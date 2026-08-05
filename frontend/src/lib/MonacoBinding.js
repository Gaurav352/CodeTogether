export class MonacoBinding {
  constructor(ytext, model, editors, awareness, monacoInstance) {
    this.ytext = ytext;
    this.model = model;
    this.editors = editors;
    this.awareness = awareness;
    this.monaco = monacoInstance; // We pass this in directly to avoid NPM import errors
    this.isSyncing = false;

    // 1. Initial Sync: Yjs -> Monaco
    const currentText = this.ytext.toString();
    if (this.model && this.model.getValue() !== currentText) {
      this.model.setValue(currentText);
    }

    // 2. Listen to Yjs changes -> Apply to Monaco
    this.ytextObserver = (event) => {
      if (this.isSyncing) return;
      this.isSyncing = true;

      try {
        let index = 0;
        // Apply edits sequentially so the string length recalculates correctly
        event.delta.forEach((op) => {
          if (op.retain !== undefined) {
            index += op.retain;
          } else if (op.insert !== undefined) {
            const pos = this.model.getPositionAt(index);
            const range = new this.monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column);
            // pushEditOperations preserves the user's Ctrl+Z undo stack!
            this.model.pushEditOperations([], [{ range, text: op.insert }], () => null);
            index += op.insert.length;
          } else if (op.delete !== undefined) {
            const start = this.model.getPositionAt(index);
            const end = this.model.getPositionAt(index + op.delete);
            const range = new this.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column);
            this.model.pushEditOperations([], [{ range, text: '' }], () => null);
          }
        });
      } finally {
        this.isSyncing = false;
      }
    };
    this.ytext.observe(this.ytextObserver);

    // 3. Listen to Monaco changes -> Apply to Yjs
    this.monacoObserver = this.model.onDidChangeContent((event) => {
      if (this.isSyncing) return;
      this.isSyncing = true;

      try {
        this.ytext.doc.transact(() => {
          // Sort changes from end to start so index offsets aren't invalidated during loop
          const changes = [...event.changes].sort((a, b) => b.rangeOffset - a.rangeOffset);
          changes.forEach((change) => {
            this.ytext.delete(change.rangeOffset, change.rangeLength);
            this.ytext.insert(change.rangeOffset, change.text);
          });
        }, this);
      } finally {
        this.isSyncing = false;
      }
    });
  }

  destroy() {
    this.ytext.unobserve(this.ytextObserver);
    this.monacoObserver.dispose();
  }
}