import * as Y from "yjs";
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from "y-protocols/awareness.js";
import ACTIONS from "../../../socketEvents.js";

export class SocketYjsProvider {
  constructor(socket, fileId, ydoc) {
    this.socket = socket;
    this.fileId = fileId;
    this.doc = ydoc;
    this.awareness = new Awareness(ydoc);

    this._onDocUpdate = (update, origin) => {
      if (origin === "remote") return;
      this.socket.emit(ACTIONS.DOC_UPDATE, { fileId, update: Array.from(update) });
    };

    this._onAwarenessUpdate = ({ added, updated, removed }, origin) => {
      if (origin === "remote") return;
      const changed = added.concat(updated, removed);
      const update = encodeAwarenessUpdate(this.awareness, changed);
      this.socket.emit(ACTIONS.DOC_AWARENESS, { fileId, update: Array.from(update) });
    };

    this._onSocketSync = ({ fileId: fid, update }) => {
      if (fid !== fileId) return;
      Y.applyUpdate(this.doc, new Uint8Array(update), "remote");
    };

    this._onSocketUpdate = ({ fileId: fid, update }) => {
      if (fid !== fileId) return;
      Y.applyUpdate(this.doc, new Uint8Array(update), "remote");
    };

    this._onSocketAwareness = ({ fileId: fid, update }) => {
      if (fid !== fileId) return;
      applyAwarenessUpdate(this.awareness, new Uint8Array(update), "remote");
    };

    this.doc.on("update", this._onDocUpdate);
    this.awareness.on("update", this._onAwarenessUpdate);
    socket.on(ACTIONS.DOC_SYNC, this._onSocketSync);
    socket.on(ACTIONS.DOC_UPDATE, this._onSocketUpdate);
    socket.on(ACTIONS.DOC_AWARENESS, this._onSocketAwareness);

    socket.emit(ACTIONS.DOC_JOIN, { fileId });
  }

  destroy() {
    this.socket.emit(ACTIONS.DOC_LEAVE, { fileId: this.fileId });
    this.socket.off(ACTIONS.DOC_SYNC, this._onSocketSync);
    this.socket.off(ACTIONS.DOC_UPDATE, this._onSocketUpdate);
    this.socket.off(ACTIONS.DOC_AWARENESS, this._onSocketAwareness);
    this.doc.off("update", this._onDocUpdate);
    this.awareness.destroy();
  }
}