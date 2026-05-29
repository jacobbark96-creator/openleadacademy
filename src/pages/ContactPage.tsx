import { useState } from "react"
import { PublicHeader } from "@/components/layout/PublicHeader"
import { PublicFooter } from "@/components/layout/PublicFooter"
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <PublicHeader />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-600 font-medium">
              Have questions about the academy? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Email Support</h3>
                      <p className="text-gray-500 mt-1">Our team typically replies within 2 hours.</p>
                      <a href="mailto:support@openlead.com" className="text-primary font-medium mt-2 inline-block">support@openlead.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">WhatsApp</h3>
                      <p className="text-gray-500 mt-1">Message us directly for quick questions.</p>
                      <Button variant="outline" className="mt-2 rounded-xl text-green-700 border-green-200 hover:bg-green-50">
                        Chat on WhatsApp
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">London Office</h3>
                      <p className="text-gray-500 mt-1">123 Sales Street, London, UK<br/>EC1A 1BB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <div className="h-64 bg-gray-200 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Google Map Placeholder
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-lg rounded-3xl">
              <CardContent className="p-8 md:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      required 
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="rounded-xl bg-gray-50 border-transparent focus:border-primary focus:bg-white resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-xl h-14 text-white text-lg mt-4 shadow-[0_8px_16px_rgba(20,184,166,0.2)] hover:shadow-[0_8px_20px_rgba(20,184,166,0.3)] transition-all bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:scale-[1.02] border border-transparent font-bold" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Send Message"}
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
