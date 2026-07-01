// localStorage-backed repository. Single device, no sync — the fallback used
// when Supabase env vars aren't set. Same shape as the Supabase repository so
// the rest of the app doesn't care which one is active.

const KEY = 'dinner-menu:meals'

function uid() {
  // Good enough for a local-only store.
  return 'local-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(meals) {
  localStorage.setItem(KEY, JSON.stringify(meals))
  // Notify subscribers in this tab; the `storage` event only fires cross-tab.
  window.dispatchEvent(new Event('dinner-menu:changed'))
}

export const localRepository = {
  async list() {
    return readAll().sort((a, b) => a.name.localeCompare(b.name))
  },

  async create(meal) {
    const now = new Date().toISOString()
    const row = { id: uid(), created_at: now, updated_at: now, ...meal }
    const meals = readAll()
    meals.push(row)
    writeAll(meals)
    return row
  },

  async update(id, patch) {
    const meals = readAll()
    const idx = meals.findIndex((m) => m.id === id)
    if (idx === -1) return null
    meals[idx] = { ...meals[idx], ...patch, updated_at: new Date().toISOString() }
    writeAll(meals)
    return meals[idx]
  },

  async remove(id) {
    writeAll(readAll().filter((m) => m.id !== id))
  },

  subscribe(onChange) {
    const handler = () => onChange()
    window.addEventListener('dinner-menu:changed', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('dinner-menu:changed', handler)
      window.removeEventListener('storage', handler)
    }
  },
}
