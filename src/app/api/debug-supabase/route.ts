import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const status = {
    url: !!supabaseUrl,
    anonKey: !!supabaseAnonKey,
    serviceRoleKey: !!serviceRoleKey,
    connectionTest: "Not started"
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ 
      error: "Missing configuration", 
      status 
    }, { status: 500 })
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey)
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    
    if (error) {
      return NextResponse.json({ 
        error: `Supabase connection failed: ${error.message}`, 
        status: { ...status, connectionTest: "Failed" } 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Supabase connection successful!", 
      status: { ...status, connectionTest: "Success" },
      data
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ 
      error: `Unexpected error: ${msg}`, 
      status: { ...status, connectionTest: "Error" } 
    }, { status: 500 })
  }
}
