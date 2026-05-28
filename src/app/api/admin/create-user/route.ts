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

    const { email, fullName, password, role } = await req.json()
    console.log(`API: Creating user ${email}...`)
    
    const supabaseAdmin = createAdminClient()
    console.log("API: Supabase admin client created")
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password || 'TempPass123!',
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })
    
    if (error) {
      console.error("API Create User Auth Error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
      
    if (data.user) {
      console.log(`API: User created in Auth, updating profile ${data.user.id}`)
      const { error: profileError } = await supabaseAdmin.from('profiles').update({ 
        role,
        email // Also sync email to profiles table
      }).eq('id', data.user.id)
      
      if (profileError) {
        console.error("API Profile Update Error:", profileError.message)
        // We don't return here because the user is already created in Auth
      }

      await supabaseAdmin.from('notifications').insert({
        user_id: data.user.id,
        title: "Welcome to Openlead Academy!",
        message: `Your account has been created.`,
        link: "/dashboard/settings"
      })
      console.log("API: Welcome notification sent")
    }
    
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("API Unexpected Error:", msg)
    return NextResponse.json({ error: `Internal server error: ${msg}` }, { status: 500 })
  }
}
