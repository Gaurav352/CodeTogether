import { createRelativePositionFromTypeIndex, createAbsolutePositionFromRelativePosition } from 'yjs';

export class MonacoBinding {
  constructor(ytext, model, editors, awareness, monacoInstance) {
    this.ytext = ytext;
    this.model = model;
    this.editors = editors;
    this.awareness = awareness;
    this.monaco = monacoInstance;
    this.isSyncing = false;
    this.decorationIds = [];

    // 1. Initial Sync: Yjs -> Monaco
    const currentText = this.ytext.toString();
    if (this.model && this.model.getValue() !== currentText) {
      this.model.setValue(currentText);
    }

    // 2. Yjs -> Monaco (Remote Changes -> Local UI)
    this.ytextObserver = (event) => {
      if (this.isSyncing) return;
      this.isSyncing = true;

      try {
        const edits = [];
        let originalIndex = 0; // Tracks the offset against the UNMUTATED document

        event.delta.forEach((op) => {
          if (op.retain !== undefined) {
            originalIndex += op.retain;
          } else if (op.insert !== undefined) {
            const pos = this.model.getPositionAt(originalIndex);
            const range = new this.monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column);

            // Push to batch array, DO NOT apply yet
            edits.push({ range, text: op.insert });

            // CRITICAL: Do NOT add insert length to originalIndex for batching
          } else if (op.delete !== undefined) {
            const start = this.model.getPositionAt(originalIndex);
            const end = this.model.getPositionAt(originalIndex + op.delete);
            const range = new this.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column);

            edits.push({ range, text: '' });

            // Deletes consume original characters, so we DO advance the index
            originalIndex += op.delete;
          }
        });

        // 💥 MAGIC FIX #1: Apply all edits silently in ONE batch call
        if (edits.length > 0) {
          this.model.applyEdits(edits);
        }
      } finally {
        this.isSyncing = false;
      }

      // 💥 MAGIC FIX #2: Force Yjs to mathematically recalculate cursors on the new text layout
      this.renderRemoteCursors();
    };
    this.ytext.observe(this.ytextObserver);

    // 3. Monaco -> Yjs (Local Changes -> Network)
    this.monacoObserver = this.model.onDidChangeContent((event) => {
      if (this.isSyncing) return;
      this.isSyncing = true;
      try {
        this.ytext.doc.transact(() => {
          const changes = [...event.changes].sort((a, b) => b.rangeOffset - a.rangeOffset);
          changes.forEach((change) => {
            this.ytext.delete(change.rangeOffset, change.rangeLength);
            this.ytext.insert(change.rangeOffset, change.text);
          });
        }, this);
      } finally {
        this.isSyncing = false;
      }

      // 💥 MAGIC FIX #3: Force remote cursors to stay put when YOU hit 'Enter' rapidly
      this.renderRemoteCursors();
    });

    // ==== 4. Local cursor/selection -> awareness ====
    const editor = [...this.editors][0]; // grab the primary editor
    this.editor = editor;

    this.cursorListener = editor.onDidChangeCursorSelection((e) => {
      const model = this.model;
      const anchorIndex = model.getOffsetAt(e.selection.getStartPosition());
      const headIndex = model.getOffsetAt(e.selection.getEndPosition());
      const anchor = createRelativePositionFromTypeIndex(this.ytext, anchorIndex, -1);
      const head = createRelativePositionFromTypeIndex(this.ytext, headIndex, -1);

      this.awareness.setLocalStateField('cursor', {
        anchor: JSON.stringify(anchor),
        head: JSON.stringify(head),
      });
    });

    this.awarenessListener = () => this.renderRemoteCursors();
    this.awareness.on('change', this.awarenessListener);
    this.renderRemoteCursors();
  }

  renderRemoteCursors() {
    const newDecorations = [];

    this.awareness.getStates().forEach((state, clientId) => {
      if (clientId === this.awareness.clientID) return; // skip self
      if (!state.cursor || !state.user) return;

      let anchor, head;
      try {
        anchor = createAbsolutePositionFromRelativePosition(JSON.parse(state.cursor.anchor), this.ytext.doc);
        head = createAbsolutePositionFromRelativePosition(JSON.parse(state.cursor.head), this.ytext.doc);
      } catch {
        return;
      }
      if (!anchor || !head) return;

      const startPos = this.model.getPositionAt(Math.min(anchor.index, head.index));
      const endPos = this.model.getPositionAt(Math.max(anchor.index, head.index));
      const isCollapsed = anchor.index === head.index;

      if (!isCollapsed) {
        newDecorations.push({
          range: new this.monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column),
          options: {
            className: `remote-selection-${clientId}`,
            hoverMessage: { value: state.user.name },
          },
        });
      }

      const caretPos = this.model.getPositionAt(head.index);
      newDecorations.push({
        range: new this.monaco.Range(caretPos.lineNumber, caretPos.column, caretPos.lineNumber, caretPos.column),
        options: {
          className: `remote-caret-${clientId}`,
          stickiness: this.monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      });

      this.injectClientStyle(clientId, state.user.color, state.user.name, state.typing);
    });

    this.decorationIds = this.editor.deltaDecorations(this.decorationIds, newDecorations);
  }

  injectClientStyle(clientId, color, name, typing) {
    const styleId = `yjs-cursor-style-${clientId}`;
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      .remote-selection-${clientId} { 
        background: ${color}33; 
      }
      .remote-caret-${clientId} { 
        border-left: 2px solid ${color}; 
        position: relative; /* Acts as the anchor for the flag */
        z-index: 10;
      }
      /* 💥 THE FIX: Attach the flag directly to the caret class! */
      .remote-caret-${clientId}::after {
        content: "${name}${typing ? ' ✎' : ''}";
        position: absolute;
        top: -1.4em;
        left: -2px;
        background: ${color};
        color: #fff;
        font-size: 11px;
        padding: 0 4px;
        border-radius: 3px;
        white-space: nowrap;
        pointer-events: none;
      }
    `;
  }

  destroy() {
    this.ytext.unobserve(this.ytextObserver);
    this.monacoObserver.dispose();
    this.cursorListener.dispose();
    this.awareness.off('change', this.awarenessListener);
    if (this.editor) {
      this.editor.deltaDecorations(this.decorationIds, []);
    }
  }
}