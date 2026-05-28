import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET() {
  return NextResponse.json({
    message: "Minimal Test: Route is working"
  }, { status: 200 })
}
