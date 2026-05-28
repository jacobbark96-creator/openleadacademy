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
    const { userId, courseIds } = await req.json()
    const supabaseAdmin = getSupabaseAdmin()
    
    await supabaseAdmin.from('course_enrollments').delete().eq('user_id', userId)
    
    if (courseIds.length > 0) {
      await supabaseAdmin.from('course_enrollments').insert(
        courseIds.map((courseId: string) => ({ user_id: userId, course_id: courseId }))
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
