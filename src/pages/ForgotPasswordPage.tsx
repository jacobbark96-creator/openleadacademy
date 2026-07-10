import { useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    // Determine the redirect URL based on environment
    const siteUrl = window.location.origin
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    })

    if (error) {
      console.error("Supabase Reset Password Error:", error)
      setErrorMsg(error.message)
      toast.error(`Failed to send email: ${error.message}`)
      setLoading(false)
      return
    }

    toast.success("Password reset email sent!")
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className="text-2xl font-black text-white text-center uppercase tracking-wider">Reset Credentials</CardTitle>
        <CardDescription className="text-center text-slate-400 font-medium">
          Verify your identity to regain access
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center space-y-6 py-4">
            <div className="text-sm text-slate-400 leading-relaxed font-medium">
              A secure reset link has been dispatched to <br />
              <strong className="text-white">{email}</strong>.
              <p className="mt-2 text-xs text-slate-500 italic">Please check your inbox and spam folder.</p>
            </div>
            <Button
              variant="outline"
              className="w-full rounded-2xl h-12 border-white/10 text-white hover:bg-white/5"
              onClick={() => setSubmitted(false)}
            >
              Try another email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold uppercase tracking-wider text-center">
                {errorMsg}
              </div>
            )}
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
            <Button
              type="submit"
              className="w-full rounded-2xl h-14 text-white shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all bg-primary hover:bg-primary/90 border-0 font-black text-sm uppercase tracking-[0.2em]"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Dispatch Reset Link"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center pb-8 border-t border-white/5 pt-6 mt-4">
        <Link to="/login" className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Secure Login
        </Link>
      </CardFooter>
    </Card>
  )
}
