import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET() {
  try {
    const env = {
      URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
      ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING",
      SERVICE: process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "MISSING",
      NODE_ENV: process.env.NODE_ENV,
    }

    return NextResponse.json({
      message: "Diagnostic Info",
      env,
      raw_keys: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || "null",
      }
    }, { status: 200 }) // Return 200 so you can see the JSON
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 200 })
  }
}
