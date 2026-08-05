import * as Y from 'yjs'
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate, removeAwarenessStates } from 'y-protocols/awareness.js'
import File from '../models/file.model.js'
import ACTIONS from '../../../socketEvents.js'

const docs = new Map() // fileId -> { ydoc, awareness, persistTimer }
const PERSIST_DEBOUNCE_MS = 2000
const IDLE_EVICT_MS = 5 * 60 * 1000

async function loadDoc(fileId) {
  const ydoc = new Y.Doc()
  const file = await File.findById(fileId).select('content yjsState')
  if (!file) throw new Error('File not found')

  if (file.yjsState && file.yjsState.length) {
    Y.applyUpdate(ydoc, new Uint8Array(file.yjsState))
  } else if (file.content) {
    ydoc.getText('content').insert(0, file.content) // migrate existing plain text once
  }
  return ydoc
}

async function getOrCreateEntry(fileId) {
  if (docs.has(fileId)) return docs.get(fileId)
  const ydoc = await loadDoc(fileId)
  const entry = { ydoc, awareness: new Awareness(ydoc), persistTimer: null, lastAccessed: Date.now() }
  docs.set(fileId, entry)
  return entry
}

function schedulePersist(fileId) {
  const entry = docs.get(fileId)
  if (!entry) return
  clearTimeout(entry.persistTimer)
  entry.persistTimer = setTimeout(() => persistNow(fileId), PERSIST_DEBOUNCE_MS)
}

async function persistNow(fileId) {
  const entry = docs.get(fileId)
  if (!entry) return
  const state = Buffer.from(Y.encodeStateAsUpdate(entry.ydoc))
  const content = entry.ydoc.getText('content').toString()
  await File.findByIdAndUpdate(fileId, { yjsState: state, content })
}

function evictIfIdle(io, fileId) {
  const room = io.sockets.adapter.rooms.get(`doc:${fileId}`)
  if (room && room.size > 0) return
  const entry = docs.get(fileId)
  if (!entry) return
  persistNow(fileId).finally(() => {
    entry.awareness.destroy()
    docs.delete(fileId)
  })
}

// call once per socket connection, alongside your existing chat handlers
export function registerYjsHandlers(io, socket) {
  socket.on(ACTIONS.DOC_JOIN, async ({ fileId }) => {
    try {
      const entry = await getOrCreateEntry(fileId)
      entry.lastAccessed = Date.now()
      socket.join(`doc:${fileId}`)

      socket.emit(ACTIONS.DOC_SYNC, {
        fileId,
        update: Array.from(Y.encodeStateAsUpdate(entry.ydoc))
      })

      const awState = Array.from(entry.awareness.getStates().keys())
      if (awState.length) {
        socket.emit(ACTIONS.DOC_AWARENESS, {
          fileId,
          update: Array.from(encodeAwarenessUpdate(entry.awareness, awState))
        })
      }
    } catch (err) {
      socket.emit(ACTIONS.DOC_ERROR ,{ fileId, message: err.message })
    }
  })

  socket.on(ACTIONS.DOC_UPDATE, ({ fileId, update }) => {
    const entry = docs.get(fileId)
    if (!entry) return
    const u8 = new Uint8Array(update)
    Y.applyUpdate(entry.ydoc, u8)
    socket.to(`doc:${fileId}`).emit(ACTIONS.DOC_UPDATE, { fileId, update })
    schedulePersist(fileId)
  })

  socket.on(ACTIONS.DOC_AWARENESS, ({ fileId, update }) => {
    const entry = docs.get(fileId)
    if (!entry) return
    applyAwarenessUpdate(entry.awareness, new Uint8Array(update), socket.id)
    socket.to(`doc:${fileId}`).emit(ACTIONS.DOC_AWARENESS, { fileId, update })
  })

  socket.on(ACTIONS.DOC_LEAVE, ({ fileId }) => {
    socket.leave(`doc:${fileId}`)
    const entry = docs.get(fileId)
    if (entry) removeAwarenessStates(entry.awareness, [socket.id], null) // best-effort; real clientID comes from awareness protocol itself
    setTimeout(() => evictIfIdle(io, fileId), 1000)
  })
}

// optional: run this on a setInterval from your main server file for GC safety
export function sweepIdleDocs(io) {
  for (const fileId of docs.keys()) {
    const entry = docs.get(fileId)
    if (Date.now() - entry.lastAccessed > IDLE_EVICT_MS) evictIfIdle(io, fileId)
  }
}