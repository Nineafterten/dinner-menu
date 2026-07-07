// Offline-first repository. The local cache is the source of truth the UI reads
// and writes instantly; Supabase is synced in the background. If Supabase is
// unreachable (outage, offline, flaky wifi), the app keeps working and queues
// writes, which flush automatically once the backend is reachable again.
//
// Single-editor model (Doug), so conflict handling is deliberately simple:
// pending local writes replay in order, then remote is pulled as the truth.
import { supabaseRepository } from './supabaseRepository'
import {
  CHANGE_EVENT,
  enqueue,
  getSyncState,
  markSynced,
  markUnreachable,
  newId,
  nowIso,
  readCache,
  readQueue,
  writeCache,
  writeQueue,
} from './cache'

let syncing = false

// Replay queued ops to Supabase, oldest first. Stop at the first failure so we
// don't drop later ops (network likely down). Returns true if fully drained.
async function flushQueue() {
  let queue = readQueue()
  while (queue.length > 0) {
    const op = queue[0]
    try {
      if (op.type === 'create') await supabaseRepository.create(op.row)
      else if (op.type === 'update') await supabaseRepository.update(op.id, op.patch)
      else if (op.type === 'remove') await supabaseRepository.remove(op.id)
    } catch {
      return false // still offline / outage — keep the queue intact
    }
    queue = queue.slice(1)
    writeQueue(queue)
  }
  return true
}

// Push local changes, then pull remote as the source of truth. Silently no-ops
// when offline so the cached data stays put.
async function sync() {
  if (syncing) return
  if (typeof navigator !== 'undefined' && !navigator.onLine) return
  syncing = true
  try {
    const drained = await flushQueue()
    if (!drained) {
      markUnreachable()
      return
    }
    const remote = await supabaseRepository.list()
    writeCache(remote)
    markSynced()
  } catch {
    // Supabase unreachable — keep serving the cache.
    markUnreachable()
  } finally {
    syncing = false
  }
}

export const offlineRepository = {
  async list() {
    // Return cache immediately; refresh from Supabase in the background.
    sync()
    return readCache().sort((a, b) => a.name.localeCompare(b.name))
  },

  async create(meal) {
    const row = { id: newId(), created_at: nowIso(), updated_at: nowIso(), ...meal }
    writeCache([...readCache(), row])
    enqueue({ type: 'create', row })
    sync()
    return row
  },

  async update(id, patch) {
    const meals = readCache()
    const idx = meals.findIndex((m) => m.id === id)
    if (idx === -1) return null
    meals[idx] = { ...meals[idx], ...patch, updated_at: nowIso() }
    writeCache(meals)
    enqueue({ type: 'update', id, patch })
    sync()
    return meals[idx]
  },

  async remove(id) {
    writeCache(readCache().filter((m) => m.id !== id))
    enqueue({ type: 'remove', id })
    sync()
  },

  subscribe(onChange) {
    const local = () => onChange()
    const online = () => sync()

    window.addEventListener(CHANGE_EVENT, local)
    window.addEventListener('storage', local)
    window.addEventListener('online', online)

    // Live updates from other devices → pull into the cache.
    const unsubRealtime = supabaseRepository.subscribe(() => sync())

    // Flush anything queued from a previous session on startup.
    sync()

    return () => {
      window.removeEventListener(CHANGE_EVENT, local)
      window.removeEventListener('storage', local)
      window.removeEventListener('online', online)
      unsubRealtime()
    }
  },

  getSyncState,
}
