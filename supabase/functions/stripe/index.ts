import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import Stripe from 'https://esm.sh/stripe@14.14.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const url = new URL(req.url)
    const { action: bodyAction, ...payload } = req.method === 'POST' ? await req.json().catch(() => ({})) : {}
    const action = url.searchParams.get('action') || bodyAction || 'connect'

    if (action === 'connect') {
      // 1. Get the authenticated user
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
      if (userError || !user) throw new Error("Unauthorized")

      // 2. Get their company
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()

      if (!profile?.company_id) throw new Error("User has no company")

      const companyId = profile.company_id

      // Use a Service Role key to bypass RLS for checking company details
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { data: company } = await supabaseAdmin
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single()

      if (!company) throw new Error("Company not found")

      let accountId = company.stripe_account_id

      // 3. Create a Stripe Express account if they don't have one
      if (!accountId) {
        const account = await stripe.accounts.create({
          type: 'express',
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_profile: {
            name: company.name,
          },
          metadata: {
            company_id: companyId
          }
        })
        accountId = account.id

        // Save it to the database
        await supabaseAdmin
          .from('companies')
          .update({ stripe_account_id: accountId })
          .eq('id', companyId)
      }

      // 4. Create an Account Link for onboarding
      const origin = req.headers.get('origin') || 'http://localhost:5173'
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${origin}/dashboard/settings?stripe=refresh`,
        return_url: `${origin}/dashboard/settings?stripe=success`,
        type: 'account_onboarding',
      })

      return new Response(JSON.stringify({ url: accountLink.url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'checkout-signup-fee') {
      const { feeAmount, feeCurrency, companyId } = payload
      
      if (!feeAmount || !feeCurrency || !companyId) {
        throw new Error("Missing required parameters for checkout")
      }

      // 1. Get the authenticated user
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
      if (userError || !user) throw new Error("Unauthorized")

      // Use a Service Role key to bypass RLS for checking company details
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { data: company } = await supabaseAdmin
        .from('companies')
        .select('stripe_account_id, name')
        .eq('id', companyId)
        .single()

      if (!company?.stripe_account_id) {
        // If the academy hasn't connected Stripe yet, we can't charge a fee
        throw new Error("This academy has not set up payments yet.")
      }

      const origin = req.headers.get('origin') || 'http://localhost:5173'

      // Create a Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: feeCurrency.toLowerCase(),
              product_data: {
                name: `Registration Fee - ${company.name}`,
              },
              unit_amount: Math.round(feeAmount * 100), // Stripe expects cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/dashboard?payment=success`,
        cancel_url: `${origin}/dashboard?payment=cancel`,
        // Pay the academy, take a fee if needed (currently 100% to academy)
        transfer_data: {
          destination: company.stripe_account_id,
        },
      })

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    throw new Error("Invalid action")

  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
