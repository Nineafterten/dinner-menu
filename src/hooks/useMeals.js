import { useCallback, useEffect, useState } from 'react'
import { hasCache } from '../data/cache'
import { localRepository } from '../data/localRepository'
import { getAdoptedAt, syncPublished } from '../data/menuFile'

// Loads meals, picks up a newer published menu.json, keeps same-tab/cross-tab
// changes in sync via localStorage events, and exposes CRUD helpers.
export function useMeals() {
  const [meals, setMeals] = useState([])
  const [publishedAt, setPublishedAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    try {
      const data = await localRepository.list()
      setMeals(data)
      setPublishedAt(getAdoptedAt())
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // A first visit waits for menu.json instead of flashing an empty menu.
    if (hasCache()) reload()
    syncPublished().finally(reload)
    return localRepository.subscribe(reload)
  }, [reload])

  const createMeal = useCallback(
    async (meal) => {
      await localRepository.create(meal)
      await reload()
    },
    [reload]
  )

  const updateMeal = useCallback(
    async (id, patch, options) => {
      // Optimistic: reflect the change immediately, then confirm.
      setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
      await localRepository.update(id, patch, options)
      await reload()
    },
    [reload]
  )

  const removeMeal = useCallback(
    async (id) => {
      await localRepository.remove(id)
      await reload()
    },
    [reload]
  )

  return { meals, publishedAt, loading, error, createMeal, updateMeal, removeMeal }
}
