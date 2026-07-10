import { useState } from "react"
import { PublicHeader } from "@/components/layout/PublicHeader"
import { PublicFooter } from "@/components/layout/PublicFooter"
import SEO from "@/components/SEO"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Mail, MessageSquare, MapPin } from "lucide-react"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate sending email via Resend API / backend
    await new Promise(r => setTimeout(r, 1000))
    toast.success("Message sent! We'll get back to you shortly.")
    setFormData({ name: "", email: "", message: "" })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <SEO 
        title="Direct Support" 
        description="Connect with our admissions team for inquiries regarding our elite sales training programs."
      />
      <PublicHeader />
      
      <main className="pt-48 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
              Connect With Us
            </h1>
            <p className="text-xl text-slate-400 font-medium">
              Have questions about the academy? Our team is standing by.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-10">
              <Card className="bg-white/5 border-white/10 shadow-2xl rounded-[32px] overflow-hidden">
                <CardContent className="p-10 space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0 border border-primary/20">
                      <Mail className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white mb-1">Priority Support</h3>
                      <p className="text-slate-500 mb-2">Typically replies within 2 hours.</p>
                      <a href="mailto:admissions@openlead.academy" className="text-primary font-bold hover:underline">admissions@openlead.academy</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-[#25D366]/10 rounded-2xl flex items-center justify-center text-[#25D366] flex-shrink-0 border border-[#25D366]/20">
                      <MessageSquare className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white mb-1">Direct WhatsApp</h3>
                      <p className="text-slate-500 mb-4">Message us for immediate assistance.</p>
                      <Button variant="outline" className="rounded-full px-6 border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all font-bold">
                        Chat Now
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 flex-shrink-0 border border-white/10">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white mb-1">London Office</h3>
                      <p className="text-slate-500">123 Sales Street, London, UK<br/>EC1A 1BB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <div className="h-64 bg-white/5 rounded-[32px] overflow-hidden relative border border-white/5 group">
                <img 
                  src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=high+end+luxury+concierge+desk+modern+minimalist+academy+lobby+teal+lighting&image_size=landscape_16_9" 
                  alt="Global Admissions Center" 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center text-white font-black uppercase tracking-widest text-xs bg-[#020617]/40">
                  Global Admissions Center
                </div>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10 shadow-2xl rounded-[40px] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
              <CardContent className="p-10 md:p-12">
                <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name</Label>
                    <Input 
                      id="name" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="rounded-2xl bg-white/5 border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary h-14"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="rounded-2xl bg-white/5 border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary h-14"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-slate-500">Inquiry</Label>
                    <Textarea 
                      id="message" 
                      required 
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="rounded-2xl bg-white/5 border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-full h-16 text-white text-xl mt-4 shadow-[0_0_20px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all bg-primary hover:bg-primary/90 border-none font-black uppercase tracking-widest" disabled={loading}>
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : "Submit Inquiry"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
