import { useCallback, useEffect, useState } from 'react'
import { repository } from '../data/repository'

// Loads meals, keeps them in sync (realtime via Supabase, or same-tab/cross-tab
// events via localStorage), and exposes CRUD helpers.
export function useMeals() {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    try {
      const data = await repository.list()
      setMeals(data)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
    const unsubscribe = repository.subscribe(reload)
    return unsubscribe
  }, [reload])

  const createMeal = useCallback(
    async (meal) => {
      await repository.create(meal)
      await reload()
    },
    [reload]
  )

  const updateMeal = useCallback(
    async (id, patch) => {
      // Optimistic: reflect the change immediately, then confirm.
      setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
      await repository.update(id, patch)
      await reload()
    },
    [reload]
  )

  const removeMeal = useCallback(
    async (id) => {
      await repository.remove(id)
      await reload()
    },
    [reload]
  )

  return { meals, loading, error, createMeal, updateMeal, removeMeal }
}
