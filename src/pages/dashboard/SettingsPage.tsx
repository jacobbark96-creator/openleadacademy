import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, ShieldCheck, ArrowRight, PaintBucket, Globe, Image as ImageIcon, CreditCard } from "lucide-react"
import { Link } from "react-router-dom"
import { useTenant } from "@/providers/TenantProvider"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { ExternalLink, Loader2, Search } from "lucide-react"

// Types for DNS Detection
interface DnsProvider {
  name: string
  url: string
  nsPatterns: string[]
}

const KNOWN_PROVIDERS: DnsProvider[] = [
  { name: 'GoDaddy', url: 'https://dcc.godaddy.com/manage/', nsPatterns: ['domaincontrol.com'] },
  { name: 'Namecheap', url: 'https://ap.www.namecheap.com/domains/list/', nsPatterns: ['namecheaphosting.com', 'registrar-servers.com'] },
  { name: 'Cloudflare', url: 'https://dash.cloudflare.com/', nsPatterns: ['cloudflare.com'] },
  { name: 'Google Domains', url: 'https://domains.google.com/registrar/', nsPatterns: ['googledomains.com'] },
  { name: 'Squarespace', url: 'https://account.squarespace.com/domains/', nsPatterns: ['squarespacedns.com'] },
  { name: 'AWS Route 53', url: 'https://console.aws.amazon.com/route53/', nsPatterns: ['awsdns'] },
  { name: 'HostGator', url: 'https://portal.hostgator.com/', nsPatterns: ['hostgator.com'] },
  { name: 'Bluehost', url: 'https://my.bluehost.com/hosting/domains', nsPatterns: ['bluehost.com'] },
  { name: 'Wix', url: 'https://manage.wix.com/', nsPatterns: ['wixdns.net'] },
]

export default function SettingsPage() {
  const { company } = useTenant()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [primaryColor, setPrimaryColor] = useState(company?.primary_color || "#000000")
  const [customDomain, setCustomDomain] = useState(company?.custom_domain || "")
  const [isEditingDomain, setIsEditingDomain] = useState(!company?.custom_domain)
  const [logoHeight, setLogoHeight] = useState(company?.logo_height || 40)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  
  // DNS Detection State
  const [isDetectingDns, setIsDetectingDns] = useState(false)
  const [detectedProvider, setDetectedProvider] = useState<DnsProvider | null>(null)
  const [dnsError, setDnsError] = useState<string | null>(null)

  // Sync state when company loads
  useEffect(() => {
    if (company) {
      setPrimaryColor(company.primary_color || "#000000")
      setCustomDomain(company.custom_domain || "")
      setIsEditingDomain(!company.custom_domain)
      setLogoHeight(company.logo_height || 40)
    }
  }, [company])

  const detectDnsProvider = async () => {
    if (!customDomain) {
      setDnsError("Please enter a custom domain first.")
      return
    }

    setIsDetectingDns(true)
    setDnsError(null)
    setDetectedProvider(null)

    try {
      // Get base domain (e.g. training.acme.com -> acme.com)
      const parts = customDomain.split('.')
      const baseDomain = parts.length > 2 ? parts.slice(-2).join('.') : customDomain

      // Query Google's DNS-over-HTTPS API for NS records
      const response = await fetch(`https://dns.google/resolve?name=${baseDomain}&type=NS`)
      const data = await response.json()

      if (data.Answer && data.Answer.length > 0) {
        const nsRecords = data.Answer.map((a: any) => a.data.toLowerCase())
        
        // Find matching provider
        const matchedProvider = KNOWN_PROVIDERS.find(provider => 
          nsRecords.some((ns: string) => 
            provider.nsPatterns.some(pattern => ns.includes(pattern))
          )
        )

        if (matchedProvider) {
          setDetectedProvider(matchedProvider)
        } else {
          setDnsError("Could not automatically detect your provider. Please select from the manual options below.")
        }
      } else {
         setDnsError("Could not find DNS records for this domain.")
      }
    } catch (err) {
      setDnsError("Failed to perform DNS lookup.")
    } finally {
      setIsDetectingDns(false)
    }
  }

  useEffect(() => {
    async function checkRole() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()
            
          if (profile?.role === "admin" || profile?.role === "superadmin") {
            setIsAdmin(true)
          }
        }
      } catch (err) {
        console.error("Failed to fetch role", err)
      } finally {
        setLoading(false)
      }
    }
    checkRole()
  }, [])

  const handleSaveBranding = async () => {
    if (!company) return
    try {
      const cleanDomain = customDomain.trim()
      const { error } = await supabase
        .from("companies")
        .update({
          primary_color: primaryColor,
          custom_domain: cleanDomain === "" ? null : cleanDomain,
          logo_height: logoHeight
        })
        .eq("id", company.id)

      if (error) {
        if (error.message.includes('unique constraint "companies_custom_domain_key"')) {
          throw new Error("This custom domain is already registered to another academy. Please choose a different one.")
        }
        throw error
      }
      
      toast.success("Platform settings updated!")
      
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings")
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!company || !e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setUploadingLogo(true)
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `logo-${company.id}-${Math.random()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars') // using existing bucket for simplicity, or we can create 'brand' bucket
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from('companies')
        .update({ logo_url: data.publicUrl })
        .eq('id', company.id)

      if (updateError) throw updateError
      
      toast.success("Logo updated successfully!")
      
      // Force reload to update context and logo component
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (err: any) {
      toast.error(err.message || "Failed to upload logo")
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleConnectStripe = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('stripe', {
        body: { action: 'connect' }
      })

      if (error) throw error
      if (data?.url) {
        window.location.href = data.url // Redirect to Stripe Onboarding
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to connect to Stripe")
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-1 -mt-2 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          Settings
        </h1>
        <p className="text-gray-500 text-sm">Manage your account preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {isAdmin && company && (
          <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden md:col-span-2">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <PaintBucket className="w-5 h-5 text-primary" />
                Platform Branding (Admin Only)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Platform Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl border border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
                        {company.logo_url ? (
                          <img src={company.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleLogoUpload}
                          disabled={uploadingLogo}
                          className="text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Recommended: Transparent PNG, max 2MB.</p>
                      </div>
                    </div>
                    {company.logo_url && (
                      <div className="pt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-gray-500">Logo Size</Label>
                          <span className="text-xs text-gray-500 font-mono">{logoHeight}px</span>
                        </div>
                        <input
                          type="range"
                          min="16"
                          max="100"
                          value={logoHeight}
                          onChange={(e) => setLogoHeight(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Primary Brand Color</Label>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="color" 
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-12 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="font-mono text-sm uppercase flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Custom Domain
                      </Label>
                      <Dialog onOpenChange={(open) => {
                        if (open && customDomain) detectDnsProvider()
                      }}>
                        <DialogTrigger render={<Button variant="link" className="h-auto p-0 text-xs text-primary" />}>
                          DNS Setup Guide
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Connect Your Domain</DialogTitle>
                            <DialogDescription>
                              To use a custom domain, you need to add a CNAME record in your domain provider's DNS settings.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-3 font-mono">
                              <div className="flex justify-between border-b pb-2">
                                <span className="text-slate-500">Type</span>
                                <span className="font-semibold text-slate-900">CNAME</span>
                              </div>
                              <div className="flex justify-between border-b pb-2">
                                <span className="text-slate-500">Name / Host</span>
                                <span className="font-semibold text-slate-900">{customDomain ? customDomain.split('.')[0] : "training"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Value / Target</span>
                                <span className="font-semibold text-slate-900">openlead-academy.pages.dev</span>
                              </div>
                            </div>
                            
                            <div className="space-y-3 pt-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">Provider Instructions</h4>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={detectDnsProvider}
                                  disabled={isDetectingDns || !customDomain}
                                  className="h-6 text-xs"
                                >
                                  {isDetectingDns ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Search className="w-3 h-3 mr-1" />}
                                  Auto-Detect
                                </Button>
                              </div>

                              {isDetectingDns ? (
                                <div className="p-6 flex flex-col items-center justify-center text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                  <p className="text-sm text-slate-600">Scanning DNS records...</p>
                                </div>
                              ) : detectedProvider ? (
                                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-sm font-medium text-emerald-900">
                                      We detected you're using <span className="font-bold">{detectedProvider.name}</span>
                                    </p>
                                  </div>
                                  <Button 
                                    render={<a href={detectedProvider.url} target="_blank" rel="noreferrer" />}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                  >
                                      Log in to {detectedProvider.name} <ExternalLink className="w-4 h-4 ml-2" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  {dnsError && <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">{dnsError}</p>}
                                  <div className="grid grid-cols-2 gap-2">
                                    {KNOWN_PROVIDERS.slice(0, 4).map(provider => (
                                      <a key={provider.name} href={provider.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 text-xs border rounded hover:bg-slate-50 transition-colors">
                                        {provider.name} <ExternalLink className="w-3 h-3" />
                                      </a>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {isEditingDomain ? (
                      <div className="flex flex-col gap-2">
                        <Input 
                          type="text" 
                          placeholder="e.g. training.yourcompany.com" 
                          value={customDomain}
                          onChange={(e) => setCustomDomain(e.target.value)}
                        />
                        {company.custom_domain && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setIsEditingDomain(false)
                              setCustomDomain(company.custom_domain || "")
                            }}
                            className="self-end text-xs h-6"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="font-mono text-sm text-gray-700 truncate">{company.custom_domain}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditingDomain(true)}
                          className="h-7 text-xs shrink-0 ml-2"
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex flex-col gap-2">
                    <Label className="flex items-center gap-2 text-gray-900">
                      <CreditCard className="w-4 h-4" /> Payments Integration
                    </Label>
                    {company.stripe_account_id ? (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">Stripe Connected</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleConnectStripe} 
                          className="h-8 text-xs text-green-700 border-green-300 hover:bg-green-100"
                        >
                          Manage Dashboard
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={handleConnectStripe}
                        className="w-full justify-start text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                      >
                        Connect Stripe Account
                      </Button>
                    )}
                    <p className="text-xs text-gray-500">Connect Stripe to charge your own users for courses.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button onClick={handleSaveBranding} className="bg-primary hover:bg-primary/90 text-white">
                  Save Platform Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Link to="/dashboard/legal">
          <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden hover:border-primary/50 transition-all group h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Legal Agreements</h3>
                    <p className="text-sm text-gray-500">View your signed NDA and agreements</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
