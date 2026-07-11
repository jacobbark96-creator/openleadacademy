import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get the session user from the Authorization header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Check if user is admin or trainer
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, company_id')
      .eq('id', user.id)
      .single()

    if (profileError || (profile?.role !== 'admin' && profile?.role !== 'trainer')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Admin/Trainer only' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      })
    }

    const { action, ...payload } = await req.json()

    if (action === 'list') {
      const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
      if (usersError) throw usersError

      // Fetch profiles only for the requesting user's company
      let profilesQuery = supabaseAdmin.from('profiles').select('*')
      if (profile.company_id) {
        profilesQuery = profilesQuery.eq('company_id', profile.company_id)
      } else {
        profilesQuery = profilesQuery.is('company_id', null)
      }
      const { data: profiles, error: profilesError } = await profilesQuery
      if (profilesError) throw profilesError

      const profileIds = profiles.map(p => p.id)

      // Filter auth users to only those belonging to the company
      const filteredAuthUsers = usersData.users.filter(u => profileIds.includes(u.id))

      const { data: enrollments } = await supabaseAdmin.from('course_enrollments').select('user_id, course_id')
      
      const result = filteredAuthUsers.map(u => {
        const p = profiles.find(profile => profile.id === u.id)
        const userEnrollments = enrollments?.filter(e => e.user_id === u.id).map(e => e.course_id) || []
        return {
          id: u.id,
          email: p?.email || u.email,
          full_name: p?.full_name || u.user_metadata?.full_name || 'Unknown',
          role: p?.role || 'student',
          phone: p?.phone || '',
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          nda_signed: p?.nda_signed,
          nda_signed_at: p?.nda_signed_at,
          subcontractor_signed: p?.subcontractor_signed,
          subcontractor_signed_at: p?.subcontractor_signed_at,
          agreement_signature_name: p?.agreement_signature_name,
          enrollments: userEnrollments
        }
      })

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'create') {
      const { email, fullName, password, role, signupFee, signupFeeCurrency, hasPaidSignupFee, companyId } = payload
      
      // Use the provided companyId or fallback to the admin's company_id
      const targetCompanyId = companyId || profile.company_id

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: password || 'TempPass123!',
        email_confirm: true,
        user_metadata: { 
          full_name: fullName,
          company_id: targetCompanyId,
          role: role,
          signup_fee: signupFee || 0,
          signup_fee_currency: signupFeeCurrency || 'GBP',
          has_paid_signup_fee: hasPaidSignupFee ?? true
        }
      })
      
      if (error) throw error
        
      if (data.user) {
        await supabaseAdmin.from('profiles').update({ 
          role,
          email,
          company_id: targetCompanyId,
          signup_fee: signupFee || 0,
          signup_fee_currency: signupFeeCurrency || 'GBP',
          has_paid_signup_fee: hasPaidSignupFee ?? true
        }).eq('id', data.user.id)

        await supabaseAdmin.from('notifications').insert({
          user_id: data.user.id,
          title: "Welcome to Openlead Academy!",
          message: `Your account has been created.`,
          link: "/dashboard/settings"
        })
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'reset-password') {
      const { email } = payload
      
      // Verify email belongs to same company
      const { data: targetProfile } = await supabaseAdmin
        .from('profiles')
        .select('company_id')
        .eq('email', email)
        .maybeSingle()
        
      if (!targetProfile || targetProfile.company_id !== profile.company_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: User not found in your company' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        })
      }

      const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email)
      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'update-password') {
      const { userId, password } = payload
      
      // Verify user belongs to same company
      const { data: targetProfile } = await supabaseAdmin
        .from('profiles')
        .select('company_id')
        .eq('id', userId)
        .maybeSingle()
        
      if (!targetProfile || targetProfile.company_id !== profile.company_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Cannot update password for user from another company' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        })
      }

      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password })
      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'update-profile') {
      const { userId, role, fullName, phone, enrollments } = payload
      
      // Verify user belongs to same company
      const { data: targetProfile, error: targetProfileError } = await supabaseAdmin
        .from('profiles')
        .select('company_id')
        .eq('id', userId)
        .maybeSingle()
        
      if (targetProfileError || !targetProfile || targetProfile.company_id !== profile.company_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Cannot update user from another company' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        })
      }

      // Update profile
      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({ role, full_name: fullName, phone })
        .eq('id', userId)
      
      if (profileUpdateError) throw profileUpdateError

      // Update enrollments if provided
      if (enrollments) {
        // Delete existing enrollments
        await supabaseAdmin.from('course_enrollments').delete().eq('user_id', userId)
        
        // Insert new ones
        if (enrollments.length > 0) {
          const enrollmentData = enrollments.map((courseId: string) => ({
            user_id: userId,
            course_id: courseId
          }))
          const { error: enrollError } = await supabaseAdmin.from('course_enrollments').insert(enrollmentData)
          if (enrollError) throw enrollError
        }
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'delete-user') {
      const { userId } = payload

      if (!userId) {
        return new Response(JSON.stringify({ error: 'userId is required', action }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }

      if (userId === user.id) {
        return new Response(JSON.stringify({ error: 'You cannot delete your own account', action }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }

      const { data: targetProfile, error: targetProfileError } = await supabaseAdmin
        .from('profiles')
        .select('role, company_id')
        .eq('id', userId)
        .maybeSingle()

      if (targetProfileError) throw targetProfileError
      if (!targetProfile) {
        return new Response(JSON.stringify({ error: 'User not found', action }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        })
      }

      if (targetProfile.company_id !== profile.company_id) {
        return new Response(JSON.stringify({ error: 'Unauthorized: User belongs to a different company', action }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        })
      }

      if (profile.role === 'trainer' && targetProfile.role !== 'student') {
        return new Response(JSON.stringify({ error: 'Trainers can only delete student accounts', action }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        })
      }

      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (deleteError) throw deleteError

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message, code: error.code, details: error.details, hint: error.hint }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
