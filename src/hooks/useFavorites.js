import { useCallback, useEffect, useState } from 'react'

// Favorites belong to whoever holds the device, so they live apart from the meals:
// publishing a new menu never touches them, and hearting a meal isn't an edit.
const FAVORITES_KEY = 'dinner-menu:favorites'

function readFavorites() {
  try {
    const ids = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
    return new Set(Array.isArray(ids) ? ids : [])
  } catch {
    return new Set()
  }
}

/** This device's favorite meal ids, and a toggle that remembers them. */
export function useFavorites() {
  const [favorites, setFavorites] = useState(readFavorites)

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === FAVORITES_KEY) setFavorites(readFavorites())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]))
      } catch {
        // Storage can be full or blocked; the heart still works for this visit.
      }
      return next
    })
  }, [])

  return { favorites, toggleFavorite }
}
