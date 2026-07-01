// Single entry point for data access. Picks Supabase when configured, else
// localStorage. Everything else in the app imports `repository` from here and
// stays agnostic about the backend.
import { isSupabaseConfigured } from '../lib/supabase'
import { localRepository } from './localRepository'
import { supabaseRepository } from './supabaseRepository'

export const repository = isSupabaseConfigured
  ? supabaseRepository
  : localRepository

export const backend = isSupabaseConfigured ? 'supabase' : 'local'
