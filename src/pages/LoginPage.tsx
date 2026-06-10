import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      toast.success("Logged in successfully!")
      navigate("/dashboard")
    } catch (error: any) {
      let friendlyError = error.message
      if (friendlyError === "Invalid login credentials") {
        friendlyError = "Incorrect email or password. Please try again."
      }
      setErrorMsg(friendlyError)
      toast.error(friendlyError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className="text-2xl font-black text-white text-center uppercase tracking-wider">Member Access</CardTitle>
        <CardDescription className="text-center text-slate-400 font-medium">
          Secure portal for elite revenue leaders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold uppercase tracking-wider text-center">
              {errorMsg}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl h-12 pl-12 focus:border-[#14B8A6]/50 focus:ring-[#14B8A6]/20 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Security Key</Label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-[#14B8A6] hover:text-[#0D9488] uppercase tracking-widest transition-colors"
              >
                Reset
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl h-12 pl-12 focus:border-[#14B8A6]/50 focus:ring-[#14B8A6]/20 transition-all"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full rounded-2xl h-14 text-white shadow-[0_0_30px_rgba(20,184,166,0.2)] hover:shadow-[0_0_40px_rgba(20,184,166,0.4)] transition-all bg-[#14B8A6] hover:bg-[#0D9488] border-0 font-black text-sm uppercase tracking-[0.2em]"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
              <span className="flex items-center">
                Enter Academy <ArrowRight className="ml-2 w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center pb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Not a member?{" "}
          <Link to="/signup" className="text-[#14B8A6] hover:text-[#0D9488] transition-colors ml-1">
            Apply for Admission
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
