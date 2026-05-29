import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const navigate = useNavigate()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setErrorMsg(error.message)
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Account created! You can now log in.")
    navigate("/login")
    setLoading(false)
  }

  return (
    <Card className="shadow-lg border-0 rounded-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Apply Now</CardTitle>
        <CardDescription className="text-center">
          Create an account to start your training journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              className="rounded-xl"
            />
          </div>
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
            <Label htmlFor="password">Password</Label>
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
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
