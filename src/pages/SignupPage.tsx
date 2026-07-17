import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useTenant } from "@/providers/TenantProvider"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { company } = useTenant()
  const isTenant = company && company.slug !== 'openlead'

  if (isTenant && !company?.allow_self_onboarding) {
    return (
      <Card className="bg-white/80 backdrop-blur-xl border-slate-200 rounded-[32px] overflow-hidden shadow-2xl p-12 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Registration Closed</h2>
        <p className="text-slate-600 mb-8">Please contact your administrator to get access to the platform.</p>
        <Button onClick={() => navigate('/login')} className="rounded-2xl">
          Return to Login
        </Button>
      </Card>
    )
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_id: company?.id // explicitly pass the company ID
          },
        },
      })

      if (error) throw error

      if (data?.user) {
        // The trigger will create the profile automatically
        toast.success("Account created! Please sign in.")
        navigate("/login")
      }
    } catch (error: Error | unknown) {
      const msg = error instanceof Error ? error.message : "Failed to create account"
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={`backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 ${isTenant ? 'bg-white/80 border-slate-200' : 'bg-white/5 border-white/10'}`}>
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className={`text-2xl font-black text-center uppercase tracking-wider transition-colors ${isTenant ? 'text-slate-900' : 'text-white'}`}>
          {isTenant ? `${company?.name} Application` : 'Candidate Application'}
        </CardTitle>
        <CardDescription className={`text-center font-medium transition-colors ${isTenant ? 'text-slate-500' : 'text-slate-400'}`}>
          {isTenant ? 'Register for your academy access' : 'Begin your journey into the elite 2%'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className={`text-xs font-bold uppercase tracking-widest ml-1 transition-colors ${isTenant ? 'text-slate-400' : 'text-slate-500'}`}>Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              className={`rounded-2xl h-12 px-4 focus:border-primary/50 focus:ring-primary/20 transition-all ${isTenant ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-600'}`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className={`text-xs font-bold uppercase tracking-widest ml-1 transition-colors ${isTenant ? 'text-slate-400' : 'text-slate-500'}`}>Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={`rounded-2xl h-12 px-4 focus:border-primary/50 focus:ring-primary/20 transition-all ${isTenant ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-600'}`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className={`text-xs font-bold uppercase tracking-widest ml-1 transition-colors ${isTenant ? 'text-slate-400' : 'text-slate-500'}`}>Security Key</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className={`rounded-2xl h-12 px-4 focus:border-primary/50 focus:ring-primary/20 transition-all ${isTenant ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-600'}`}
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-2xl h-14 text-white shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all bg-primary hover:bg-primary/90 border-0 font-black text-sm uppercase tracking-[0.2em]"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Application"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center pb-8">
        <div className={`text-xs font-bold uppercase tracking-widest transition-colors ${isTenant ? 'text-slate-400' : 'text-slate-500'}`}>
          Already a member?{" "}
          <Link to="/login" className="text-primary hover:text-primary/90 transition-colors ml-1">
            Access Portal
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
