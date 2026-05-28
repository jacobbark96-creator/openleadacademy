"use server"

import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured on the server.")
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

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
}

export async function getAdminUsers() {
  try {
    await verifyAdmin()
    const supabaseAdmin = getSupabaseAdmin()
    
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error) return []

    const { data: profiles, error: profilesError } = await supabaseAdmin.from('profiles').select('*')
    if (profilesError) return []

    const { data: enrollments, error: enrollmentsError } = await supabaseAdmin.from('course_enrollments').select('user_id, course_id')
    if (enrollmentsError) console.error("Enrollments fetch error:", enrollmentsError)

    return users.map(user => {
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
  } catch (err) {
    console.error("getAdminUsers error:", err)
    return []
  }
}

export async function adminUpdateUserProfile(userId: string, data: { full_name?: string, role?: string, phone?: string }) {
  try {
    await verifyAdmin()
    const supabaseAdmin = getSupabaseAdmin()
    
    const { error } = await supabaseAdmin.from('profiles').update(data).eq('id', userId)
    if (error) return { error: error.message }
    
    return { success: true }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return { error: err.message || "Failed to update profile" }
  }
}

export async function adminManageEnrollments(userId: string, courseIds: string[]) {
  try {
    await verifyAdmin()
    const supabaseAdmin = getSupabaseAdmin()
    
    // First, delete existing enrollments for this user
    const { error: deleteError } = await supabaseAdmin.from('course_enrollments').delete().eq('user_id', userId)
    if (deleteError) return { error: deleteError.message }
    
    if (courseIds.length > 0) {
      // Then insert new enrollments
      const { error: insertError } = await supabaseAdmin.from('course_enrollments').insert(
        courseIds.map(courseId => ({ user_id: userId, course_id: courseId }))
      )
      if (insertError) return { error: insertError.message }
    }
    
    return { success: true }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return { error: err.message || "Failed to manage enrollments" }
  }
}

export async function adminUpdateUserPassword(userId: string, newPassword: string) {
  try {
    await verifyAdmin()
    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword })
    if (error) return { error: error.message }
      
    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      title: "Password Updated",
      message: "Your password was recently updated by an administrator.",
      link: "/dashboard/settings"
    })
      
    return { success: true }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return { error: err.message || "Failed to update password" }
  }
}

export async function adminSendPasswordReset(email: string) {
  try {
    await verifyAdmin()
    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email)
    if (error) return { error: error.message }
    return { success: true }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return { error: err.message || "Failed to send reset email" }
  }
}

export async function adminCreateUser(email: string, fullName: string, role: string, temporaryPassword?: string) {
  try {
    await verifyAdmin()
    const supabaseAdmin = getSupabaseAdmin()
    
    console.log(`Admin creating user: ${email} with role: ${role}`)
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: temporaryPassword || 'TempPass123!',
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })
    
    if (error) {
      console.error("Supabase Admin CreateUser Error:", error)
      return { error: error.message }
    }
      
    if (data.user) {
      // The handle_new_user trigger will create the profile with 'student' role.
      // We update it to the desired role.
      const { error: profileError } = await supabaseAdmin.from('profiles').update({ role }).eq('id', data.user.id)
      if (profileError) console.error("Profile update error:", profileError)
      
      // Create welcome notification
      const { error: notifError } = await supabaseAdmin.from('notifications').insert({
        user_id: data.user.id,
        title: "Welcome to Openlead Academy!",
        message: `Your account has been created. Please change your temporary password.`,
        link: "/dashboard/settings"
      })
      if (notifError) console.error("Notification insert error:", notifError)
    }
    
    return { success: true }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("adminCreateUser Exception:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}