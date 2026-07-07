// Shared local store. This is the source of truth the UI reads from, so the app
// is instant and works fully offline. When Supabase is configured, the offline
// repository keeps this cache and Supabase in sync in the background.

const CACHE_KEY = 'dinner-menu:meals'
const QUEUE_KEY = 'dinner-menu:pending'

// Fires when the cached meals change (same-tab; `storage` covers cross-tab).
export const CHANGE_EVENT = 'dinner-menu:changed'
// Fires when sync status changes (online/offline, pending count).
export const SYNC_EVENT = 'dinner-menu:sync'

export function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  // Fallback for older environments.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function nowIso() {
  return new Date().toISOString()
}

// --- Cached meals ---------------------------------------------------------

export function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function writeCache(meals) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(meals))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

// --- Pending write queue (ops that still need to reach Supabase) -----------

export function readQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function writeQueue(ops) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(ops))
  emitSync()
}

export function enqueue(op) {
  writeQueue([...readQueue(), op])
}

// --- Sync status (for the header badge) ------------------------------------

let lastSyncedAt = null
let reachable = true // whether the last Supabase contact succeeded

export function markSynced() {
  lastSyncedAt = nowIso()
  reachable = true
  emitSync()
}

export function markUnreachable() {
  reachable = false
  emitSync()
}

export function getSyncState() {
  return {
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
    reachable,
    pending: readQueue().length,
    lastSyncedAt,
  }
}

function emitSync() {
  window.dispatchEvent(new Event(SYNC_EVENT))
}
