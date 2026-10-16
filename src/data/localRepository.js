// localStorage repository: each device keeps its own copy of the menu.
import {
  CHANGE_EVENT,
  newId,
  nowIso,
  readCache,
  writeCache,
} from './cache'

export const localRepository = {
  async list() {
    return readCache().sort((a, b) => a.name.localeCompare(b.name))
  },

  async create(meal) {
    const row = { id: newId(), created_at: nowIso(), updated_at: nowIso(), ...meal }
    writeCache([...readCache(), row])
    return row
  },

  async update(id, patch) {
    const meals = readCache()
    const idx = meals.findIndex((m) => m.id === id)
    if (idx === -1) return null
    meals[idx] = { ...meals[idx], ...patch, updated_at: nowIso() }
    writeCache(meals)
    return meals[idx]
  },

  async remove(id) {
    writeCache(readCache().filter((m) => m.id !== id))
  },

  subscribe(onChange) {
    const handler = () => onChange()
    window.addEventListener(CHANGE_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(CHANGE_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  },
}
