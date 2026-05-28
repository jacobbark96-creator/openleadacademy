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
    const { email } = await req.json()
    const supabaseAdmin = getSupabaseAdmin()
    
    const { error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
    })
    
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    
    // In a real app, you would send this link via email. 
    // Supabase can also handle this automatically with auth.resetPasswordForEmail
    const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email)
    if (resetError) return NextResponse.json({ error: resetError.message }, { status: 400 })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 })
  }
}
