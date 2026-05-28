import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const runtime = "edge"

async function verifyAdmin() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) throw new Error("Unauthorized")
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'trainer') throw new Error("Unauthorized")
}

function getSupabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export async function POST(req: Request) {
  try {
    await verifyAdmin()
    const { email, fullName, role, password } = await req.json()
    const supabaseAdmin = getSupabaseAdmin()
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password || 'TempPass123!',
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })
    
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      
    if (data.user) {
      await supabaseAdmin.from('profiles').update({ role }).eq('id', data.user.id)
      await supabaseAdmin.from('notifications').insert({
        user_id: data.user.id,
        title: "Welcome to Openlead Academy!",
        message: `Your account has been created.`,
        link: "/dashboard/settings"
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 })
  }
}
