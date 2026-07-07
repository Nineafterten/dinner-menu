import { useEffect, useState } from 'react'
import { repository } from '../data/repository'
import { SYNC_EVENT, CHANGE_EVENT } from '../data/cache'

// Tracks online/offline + pending-write count for the header badge. Only
// meaningful when the offline-first (Supabase) repository is active; the pure
// local repository has no getSyncState, so this reports a stable "local" state.
export function useSyncStatus() {
  const [state, setState] = useState(() =>
    repository.getSyncState ? repository.getSyncState() : null
  )

  useEffect(() => {
    if (!repository.getSyncState) return
    const update = () => setState(repository.getSyncState())
    update()
    window.addEventListener(SYNC_EVENT, update)
    window.addEventListener(CHANGE_EVENT, update)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener(SYNC_EVENT, update)
      window.removeEventListener(CHANGE_EVENT, update)
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  return state
}
