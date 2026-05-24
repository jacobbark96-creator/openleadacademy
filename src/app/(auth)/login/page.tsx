"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Environment variables missing! Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to Cloudflare.")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Successfully logged in!")
    router.push("/dashboard")
    setLoading(false)
  }

  return (
    <Card className="shadow-lg border-0 rounded-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Student Login</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="rounded-xl"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-xl h-12 text-white shadow-[0_8px_16px_rgba(20,184,166,0.2)] hover:shadow-[0_8px_20px_rgba(20,184,166,0.3)] transition-all bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:scale-[1.02] border border-transparent font-bold text-[15px]"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Apply Now
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
