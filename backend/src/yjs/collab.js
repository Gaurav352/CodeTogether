import * as Y from 'yjs'
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate, removeAwarenessStates } from 'y-protocols/awareness.js'
import File from '../models/file.model.js'
import ACTIONS from '../../../socketEvents.js'

const docs = new Map() // fileId -> { ydoc, awareness, socketClients, persistTimer, lastAccessed }
const PERSIST_DEBOUNCE_MS = 2000
const IDLE_EVICT_MS = 5 * 60 * 1000

async function loadDoc(fileId) {
  const ydoc = new Y.Doc()
  const file = await File.findById(fileId).select('content yjsState')
  if (!file) throw new Error('File not found')

  if (file.yjsState && file.yjsState.length) {
    Y.applyUpdate(ydoc, new Uint8Array(file.yjsState))
  } else if (file.content) {
    ydoc.getText('content').insert(0, file.content)
  }
  return ydoc
}

async function getOrCreateEntry(io, fileId) {
  if (docs.has(fileId)) return docs.get(fileId)
  const ydoc = await loadDoc(fileId)
  const awareness = new Awareness(ydoc)
  const socketClients = new Map() // socket.id -> Set<awareness clientID>

  // Single source of truth for broadcasting awareness changes, regardless of
  // whether they came from a client message, an explicit leave, or Yjs's
  // own internal stale-client timeout.
  awareness.on('update', ({ added, updated, removed }, origin) => {
    const changed = added.concat(updated, removed)
    if (!changed.length) return

    // Track socket.id -> awareness clientID mapping so we can clean up correctly later
    if (typeof origin === 'string') {
      if (!socketClients.has(origin)) socketClients.set(origin, new Set())
      const set = socketClients.get(origin)
      added.concat(updated).forEach((id) => set.add(id))
      removed.forEach((id) => set.delete(id))
    }

    const update = Array.from(encodeAwarenessUpdate(awareness, changed))
    const room = io.sockets.adapter.rooms.get(`doc:${fileId}`)
    if (!room) return
    for (const sid of room) {
      if (sid === origin) continue // the origin socket already has this state locally
      io.sockets.sockets.get(sid)?.emit(ACTIONS.DOC_AWARENESS, { fileId, update })
    }
  })

  const entry = { ydoc, awareness, socketClients, persistTimer: null, lastAccessed: Date.now() }
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

function cleanupSocketFromDoc(fileId, entry, socketId) {
  const clientIds = Array.from(entry.socketClients.get(socketId) || [])
  if (clientIds.length) {
    removeAwarenessStates(entry.awareness, clientIds, socketId)
  }
  entry.socketClients.delete(socketId)
}

export function registerYjsHandlers(io, socket) {
  socket.on(ACTIONS.DOC_JOIN, async ({ fileId }) => {
    try {
      const entry = await getOrCreateEntry(io, fileId)
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
      socket.emit(ACTIONS.DOC_ERROR, { fileId, message: err.message })
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
    // broadcasting is now handled entirely by the awareness.on('update') listener above
  })

  socket.on(ACTIONS.DOC_LEAVE, ({ fileId }) => {
    socket.leave(`doc:${fileId}`)
    const entry = docs.get(fileId)
    if (entry) cleanupSocketFromDoc(fileId, entry, socket.id)
    setTimeout(() => evictIfIdle(io, fileId), 1000)
  })

  // NEW: catch tab closes, crashes, dropped connections — anything that skips DOC_LEAVE
  socket.on('disconnect', () => {
    for (const [fileId, entry] of docs.entries()) {
      if (entry.socketClients.has(socket.id)) {
        cleanupSocketFromDoc(fileId, entry, socket.id)
        setTimeout(() => evictIfIdle(io, fileId), 1000)
      }
    }
  })
}

export function sweepIdleDocs(io) {
  for (const fileId of docs.keys()) {
    const entry = docs.get(fileId)
    if (Date.now() - entry.lastAccessed > IDLE_EVICT_MS) evictIfIdle(io, fileId)
  }
}