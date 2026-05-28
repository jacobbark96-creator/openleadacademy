import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const runtime = "edge"

async function verifyAdmin() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) throw new Error("Unauthorized")
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()
    
  if (profile?.role !== 'admin' && profile?.role !== 'trainer') {
    throw new Error("Unauthorized: Must be an admin or trainer")
  }
  return session.user
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase configuration is missing.")
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export async function GET() {
  console.log("API: Fetching admin users...")
  try {
    try {
      await verifyAdmin()
    } catch (authErr: any) {
      console.error("API Auth Error:", authErr.message)
      return NextResponse.json({ error: `Authentication failed: ${authErr.message}` }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    console.log("API: Supabase admin client created")
    
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error) {
      console.error("API List Users Error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: profiles, error: profilesError } = await supabaseAdmin.from('profiles').select('*')
    if (profilesError) {
      console.error("API List Profiles Error:", profilesError.message)
      return NextResponse.json({ error: profilesError.message }, { status: 500 })
    }

    const { data: enrollments } = await supabaseAdmin.from('course_enrollments').select('user_id, course_id')
    
    const result = users.map(user => {
      const profile = profiles.find(p => p.id === user.id)
      const userEnrollments = enrollments?.filter(e => e.user_id === user.id).map(e => e.course_id) || []
      return {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.user_metadata?.full_name || 'Unknown',
        role: profile?.role || 'student',
        phone: profile?.phone || '',
        youtube_url: profile?.youtube_url,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        enrollments: userEnrollments
      }
    })

    console.log(`API: Successfully fetched ${result.length} users`)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error("API Unexpected Error:", err.message, err.stack)
    return NextResponse.json({ error: `Internal server error: ${err.message}` }, { status: 500 })
  }
}
