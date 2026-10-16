// This device's copy of the menu, in localStorage. It's the source of truth the
// UI reads and writes, so the app is instant and works fully offline.

const CACHE_KEY = 'dinner-menu:meals'

// Fires when the cached meals change (same-tab; `storage` covers cross-tab).
export const CHANGE_EVENT = 'dinner-menu:changed'

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

export function hasCache() {
  return localStorage.getItem(CACHE_KEY) !== null
}

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
