import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SEO from "@/components/SEO"
import { toast } from "sonner"
import { Loader2, Building, MapPin, User, Mail, Lock } from "lucide-react"

export default function RegisterAcademyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const plan = searchParams.get("plan") || "starter"

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    subdomain: "",
    location: "",
    fullName: "",
    email: "",
    password: "",
  })

  const handleCompanyNameChange = (name: string) => {
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, companyName: name, subdomain: slug }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Basic uniqueness check for slug (this is just a UX helper, the DB will enforce it)
      const { data: existing } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', formData.subdomain)
        .maybeSingle()

      if (existing) {
        throw new Error("This subdomain is already taken. Please choose another.")
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            new_company_name: formData.companyName,
            new_company_slug: formData.subdomain,
            location: formData.location,
          },
        },
      })

      if (error) throw error

      toast.success("Academy infrastructure provisioning...")
      
      // Simulate Stripe checkout delay for the 14-day trial
      setTimeout(() => {
        toast.success("14-Day Free Trial activated! Redirecting to setup...")
        window.location.href = "/dashboard/settings"
      }, 2500)

    } catch (error: any) {
      toast.error(error.message || "Failed to create academy")
      setIsLoading(false)
    }
  }

  return (
    <>
      <SEO title="Start Your Academy" />
      
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
            Launch Your Academy
          </h1>
          <p className="text-sm text-slate-400">
            Start your 14-day free trial on the {plan === 'commercial' ? 'Commercial' : 'Internal Team'} plan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Academy Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Company / Academy Name
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="companyName"
                  type="text"
                  required
                  placeholder="e.g. Acme Corp Training"
                  className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-slate-600 h-12"
                  value={formData.companyName}
                  onChange={(e) => handleCompanyNameChange(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subdomain" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Your Academy URL
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    id="subdomain"
                    type="text"
                    required
                    placeholder="my-academy"
                    className="bg-black/50 border-white/10 text-white placeholder:text-slate-600 h-12 pr-4 text-right font-bold text-primary"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') })}
                  />
                </div>
                <span className="text-sm font-bold text-slate-500 whitespace-nowrap">.openleadacademy.com</span>
              </div>
              <p className="text-[10px] text-slate-500">This will be your permanent platform URL.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Location / Country
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="location"
                  type="text"
                  required
                  placeholder="e.g. United Kingdom"
                  className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-slate-600 h-12"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Admin Profile</h3>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Your Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="fullName"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-slate-600 h-12"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@company.com"
                  className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-slate-600 h-12"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-slate-600 h-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black tracking-widest uppercase shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Start 14-Day Free Trial"
            )}
          </Button>

          <p className="text-center text-xs text-slate-500 mt-4">
            By starting your trial, you agree to our Terms of Service and Privacy Policy. No credit card required.
          </p>
        </form>
      </div>
    </>
  )
}