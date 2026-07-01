// Supabase-backed repository. Real multi-device sync via Postgres + realtime.
import { supabase } from '../lib/supabase'

const TABLE = 'meals'

export const supabaseRepository = {
  async list() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('name', { ascending: true })
    if (error) throw error
    return data
  },

  async create(meal) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(meal)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, patch) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
  },

  subscribe(onChange) {
    const channel = supabase
      .channel('meals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, () =>
        onChange()
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  },
}
