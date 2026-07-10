import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className="text-2xl font-black text-white text-center uppercase tracking-wider">Candidate Application</CardTitle>
        <CardDescription className="text-center text-slate-400 font-medium">
          Begin your journey into the elite 2%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl h-12 focus:border-primary/50 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl h-12 focus:border-primary/50 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Security Key</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl h-12 focus:border-primary/50 focus:ring-primary/20 transition-all"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-2xl h-14 text-white shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all bg-primary hover:bg-primary/90 border-0 font-black text-sm uppercase tracking-[0.2em]"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Initiate Application"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center pb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Already a candidate?{" "}
          <Link to="/login" className="text-primary hover:text-primary/90 transition-colors ml-1">
            Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
