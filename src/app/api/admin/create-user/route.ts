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
  console.log("API: Creating new user...")
  try {
    try {
      await verifyAdmin()
    } catch (authErr: any) {
      console.error("API Auth Error:", authErr.message)
      return NextResponse.json({ error: `Authentication failed: ${authErr.message}` }, { status: 401 })
    }

    const { email, fullName, role, password } = await req.json()
    console.log(`API: Creating user ${email} with role ${role}`)
    
    const supabaseAdmin = getSupabaseAdmin()
    
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
      const { error: profileError } = await supabaseAdmin.from('profiles').update({ role }).eq('id', data.user.id)
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
  } catch (err: any) {
    console.error("API Unexpected Error:", err.message, err.stack)
    return NextResponse.json({ error: `Internal server error: ${err.message}` }, { status: 500 })
  }
}
