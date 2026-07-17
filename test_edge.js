import { createClient } from '@supabase/supabase-js'

const url = 'https://umsfnckxuqkmzsndselx.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // we'll pass this in
const supabase = createClient(url, key)

async function test() {
  const { data, error } = await supabase.functions.invoke('send-tenant-invite', {
    body: { email: 'test@example.com', companyName: 'Test Company', action: 'welcome' }
  })
  if (error) {
     const body = await error.context.json()
     console.log('Error Body:', body)
  }
}
test()
