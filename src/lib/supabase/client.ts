import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Browser Client: Missing Supabase URL or Key! Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.')
  }

  return createSupabaseClient(
    supabaseUrl || '',
    supabaseKey || ''
  )
}
