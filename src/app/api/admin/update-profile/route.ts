import { createAdminClient } from "@/lib/supabase/admin"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const runtime = "edge"

async function verifyAdmin() {
  const supabase = await createServerClient()
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.error("Auth session error:", sessionError.message)
    throw new Error(`Auth session failed: ${sessionError.message}`)
  }
  
  if (!session?.user) throw new Error("Unauthorized: No session found")
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()
    
  if (profileError) {
    console.error("Profile fetch error:", profileError.message)
    throw new Error(`Profile check failed: ${profileError.message}`)
  }
    
  if (profile?.role !== 'admin' && profile?.role !== 'trainer') {
    throw new Error("Unauthorized: Must be an admin or trainer")
  }
}

export async function POST(req: Request) {
  try {
    try {
      await verifyAdmin()
    } catch (authErr: unknown) {
      const msg = authErr instanceof Error ? authErr.message : String(authErr)
      console.error("API Auth Error:", msg)
      return NextResponse.json({ error: msg }, { status: 401 })
    }

    const { userId, role, fullName, phone } = await req.json()
    const supabaseAdmin = createAdminClient()
    
    const { error } = await supabaseAdmin.from('profiles').update({ role, full_name: fullName, phone }).eq('id', userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
