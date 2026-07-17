import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

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
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set.")
    }

    const { email, companyName, action } = await req.json()

    if (!email || !companyName) {
      throw new Error("Missing email or companyName")
    }

    // You can customize this to be an invite, password reset, etc.
    let subject = `Welcome to ${companyName}`
    let htmlContent = `
      <h2>Welcome to ${companyName}!</h2>
      <p>Your account has been created. Please sign in to access your dashboard.</p>
    `

    if (action === 'reset-password') {
      subject = `Password Reset for ${companyName}`
      htmlContent = `
        <h2>Password Reset</h2>
        <p>You requested a password reset for your ${companyName} account.</p>
        <p>Please follow the link provided to reset your password.</p>
      `
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: `${companyName} <help@openleadacademy.com>`, // Dynamic sender name!
        to: [email],
        subject: subject,
        html: htmlContent
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to send email via Resend')
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error('Error sending email:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
