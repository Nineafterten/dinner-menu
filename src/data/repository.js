// Single entry point for data access.
// - Supabase configured -> offline-first repository (local cache + background sync)
// - not configured       -> pure localStorage repository
// Everything else in the app imports `repository` and stays backend-agnostic.
import { isSupabaseConfigured } from '../lib/supabase'
import { localRepository } from './localRepository'
import { offlineRepository } from './offlineRepository'

export const repository = isSupabaseConfigured
  ? offlineRepository
  : localRepository

export const backend = isSupabaseConfigured ? 'supabase' : 'local'
