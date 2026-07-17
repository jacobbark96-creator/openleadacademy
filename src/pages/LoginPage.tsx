import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react"
import { useTenant } from "@/providers/TenantProvider"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const navigate = useNavigate()
  const { company } = useTenant()
  const isTenant = company && company.slug !== 'openlead'

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
    <Card className={`backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 ${isTenant ? 'bg-white/80 border-slate-200' : 'bg-white/5 border-white/10'}`}>
      {(company?.allow_self_onboarding || !isTenant) && (
        <div className={`flex p-1 mx-6 mt-6 rounded-2xl ${isTenant ? 'bg-slate-100' : 'bg-[#020617]/50'}`}>
          <Link 
            to="/signup" 
            className={`flex-1 text-center py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              isTenant ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </Link>
          <div 
            className={`flex-1 text-center py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm ${
              isTenant ? 'bg-white text-slate-900' : 'bg-white/10 text-white'
            }`}
          >
            Login
          </div>
        </div>
      )}
      {!isTenant && (
        <CardHeader className="space-y-2 pb-8 pt-6">
          <CardTitle className="text-2xl font-black text-center uppercase tracking-wider text-white">
            Member Access
          </CardTitle>
          <CardDescription className="text-center font-medium text-slate-400">
            Secure portal for elite revenue leaders
          </CardDescription>
        </CardHeader>
      )}
      {isTenant && <div className="pt-6" />}
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          {errorMsg && (
            <div className={`p-4 border rounded-2xl text-xs font-bold uppercase tracking-wider text-center transition-all ${isTenant ? 'bg-red-50 border-red-200 text-red-600' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {errorMsg}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className={`text-xs font-bold uppercase tracking-widest ml-1 transition-colors ${isTenant ? 'text-slate-400' : 'text-slate-500'}`}>Email Address</Label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isTenant ? 'text-slate-400' : 'text-slate-500'}`} />
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className={`rounded-2xl h-12 pl-12 focus:border-primary/50 focus:ring-primary/20 transition-all ${isTenant ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-600'}`}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className={`text-xs font-bold uppercase tracking-widest transition-colors ${isTenant ? 'text-slate-400' : 'text-slate-500'}`}>Security Key</Label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-primary hover:text-primary/90 uppercase tracking-widest transition-colors"
              >
                Reset
              </Link>
            </div>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isTenant ? 'text-slate-400' : 'text-slate-500'}`} />
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className={`rounded-2xl h-12 pl-12 focus:border-primary/50 focus:ring-primary/20 transition-all ${isTenant ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-600'}`}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full rounded-2xl h-14 text-white shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all bg-primary hover:bg-primary/90 border-0 font-black text-sm uppercase tracking-[0.2em]"
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
    </Card>
  )
}
