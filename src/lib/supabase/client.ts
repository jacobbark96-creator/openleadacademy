import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Browser Client: Missing Supabase URL or Key! Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.')
}

// Create a single instance to be reused throughout the app
export const supabase = createSupabaseClient(
  supabaseUrl || '',
  supabaseKey || ''
)

// Export for backward compatibility
export function createClient() {
  return supabase
}
