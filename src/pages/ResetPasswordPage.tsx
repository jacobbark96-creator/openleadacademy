import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      // Small delay to allow hash processing
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (mounted) {
        if (session) {
          setVerifying(false)
        } else {
          toast.error("Invalid or expired reset link")
          navigate("/login")
        }
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        if (mounted) setVerifying(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [navigate])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Password updated successfully!")
    navigate("/dashboard")
    setLoading(false)
  }

  if (verifying) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#14B8A6]/20 blur-xl rounded-full animate-pulse" />
            <Loader2 className="h-10 w-10 animate-spin text-[#14B8A6] relative z-10" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Verifying Credentials...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className="text-2xl font-black text-white text-center uppercase tracking-wider">Update Vault Key</CardTitle>
        <CardDescription className="text-center text-slate-400 font-medium">
          Establish your new secure access credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">New Security Key</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl h-12 pr-12 focus:border-[#14B8A6]/50 focus:ring-[#14B8A6]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#14B8A6] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Confirm New Key</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl h-12 focus:border-[#14B8A6]/50 focus:ring-[#14B8A6]/20 transition-all"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-2xl h-14 text-white shadow-[0_0_30px_rgba(20,184,166,0.2)] hover:shadow-[0_0_40px_rgba(20,184,166,0.4)] transition-all bg-[#14B8A6] hover:bg-[#0D9488] border-0 font-black text-sm uppercase tracking-[0.2em]"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Authorize New Key"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
