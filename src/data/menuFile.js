// The menu as a JSON file: exported from edit mode, imported back, and shipped
// with the site as public/menu.json so every device sees the published menu.
import { hasCache, readCache, writeCache } from './cache'

const APP = 'dinner-menu'
const VERSION = 1
const PUBLISHED_URL = '/menu.json'
// exportedAt of the published menu this device last took. Absent means the
// device keeps its own copy (data from before menu.json, or an import).
const ADOPTED_KEY = 'dinner-menu:published-at'

export function getAdoptedAt() {
  return localStorage.getItem(ADOPTED_KEY)
}

/** Download this device's meals as menu.json, ready to replace public/menu.json. */
export function exportToFile() {
  const meals = readCache().sort((a, b) => a.name.localeCompare(b.name))
  const file = { app: APP, version: VERSION, exportedAt: new Date().toISOString(), meals }
  const blob = new Blob([`${JSON.stringify(file, null, 2)}\n`], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'menu.json'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
  return meals.length
}

function isMeal(value) {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.name === 'string'
  )
}

function parseMenuFile(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('That file is not valid JSON.')
  }
  if (!data || !Array.isArray(data.meals)) {
    throw new Error('This does not look like a Dinner Menu file.')
  }
  return { exportedAt: data.exportedAt, meals: data.meals.filter(isMeal) }
}

/** Replace this device's meals with a file's; the device then keeps its own copy. */
export async function importFromFile(file) {
  const { meals } = parseMenuFile(await file.text())
  if (!meals.length) throw new Error('No meals were found in that file.')
  writeCache(meals)
  localStorage.removeItem(ADOPTED_KEY)
  return meals.length
}

async function fetchPublished() {
  try {
    const res = await fetch(PUBLISHED_URL, { cache: 'no-cache' })
    if (!res.ok) return null
    const published = parseMenuFile(await res.text())
    return published.exportedAt ? published : null
  } catch {
    return null
  }
}

function adopt(published) {
  writeCache(published.meals)
  localStorage.setItem(ADOPTED_KEY, published.exportedAt)
}

function latestChange(meals) {
  return meals.reduce((latest, m) => (m.updated_at > latest ? m.updated_at : latest), '')
}

/**
 * Take the published menu if this device has no meals yet, or if it follows the
 * published menu and a newer one is out than anything changed on this device.
 * Offline, or with no menu.json, the device keeps what it has.
 */
export async function syncPublished() {
  const published = await fetchPublished()
  if (!published) return false
  if (hasCache()) {
    const adoptedAt = getAdoptedAt()
    if (!adoptedAt || published.exportedAt <= adoptedAt) return false
    if (latestChange(readCache()) > published.exportedAt) return false
  }
  adopt(published)
  return true
}

/** Replace this device's meals with the published menu and follow it again. */
export async function restorePublished() {
  const published = await fetchPublished()
  if (!published) throw new Error("Couldn't load the published menu.")
  adopt(published)
  return published.meals.length
}
