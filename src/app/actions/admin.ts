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
  await verifyAdmin()
  const supabaseAdmin = getSupabaseAdmin()
  
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
  if (error) throw new Error(error.message)

  const { data: profiles, error: profilesError } = await supabaseAdmin.from('profiles').select('*')
  if (profilesError) throw new Error(profilesError.message)

  return users.map(user => {
    const profile = profiles.find(p => p.id === user.id)
    return {
      id: user.id,
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.full_name || 'Unknown',
      role: profile?.role || 'student',
      youtube_url: profile?.youtube_url,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
    }
  })
}

export async function adminUpdateUserPassword(userId: string, newPassword: string) {
  await verifyAdmin()
  const supabaseAdmin = getSupabaseAdmin()
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword })
  if (error) throw new Error(error.message)
    
  await supabaseAdmin.from('notifications').insert({
    user_id: userId,
    title: "Password Updated",
    message: "Your password was recently updated by an administrator.",
    link: "/dashboard/settings"
  })
    
  return { success: true }
}

export async function adminSendPasswordReset(email: string) {
  await verifyAdmin()
  const supabaseAdmin = getSupabaseAdmin()
  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email)
  if (error) throw new Error(error.message)
  return { success: true }
}

export async function adminCreateUser(email: string, fullName: string, role: string, temporaryPassword?: string) {
  await verifyAdmin()
  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: temporaryPassword || 'TempPass123!',
    email_confirm: true,
    user_metadata: { full_name: fullName }
  })
  
  if (error) throw new Error(error.message)
    
  if (data.user) {
    // The handle_new_user trigger will create the profile with 'student' role.
    // We update it to the desired role.
    await supabaseAdmin.from('profiles').update({ role }).eq('id', data.user.id)
    
    // Create welcome notification
    await supabaseAdmin.from('notifications').insert({
      user_id: data.user.id,
      title: "Welcome to Openlead Academy!",
      message: `Your account has been created. Please change your temporary password.`,
      link: "/dashboard/settings"
    })
  }
  
  return { success: true }
}