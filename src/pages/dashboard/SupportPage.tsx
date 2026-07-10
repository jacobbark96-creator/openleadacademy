import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Headphones, Send, MessageSquare, LifeBuoy, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"

export default function SupportPage() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject,
          message,
          status: 'open'
        })

      if (error) throw error

      setSubmitted(true)
      toast.success("Support ticket submitted successfully!")
    } catch (error: any) {
      console.error("Error submitting ticket:", error)
      toast.error("Failed to submit support ticket")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-1 -mt-2 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          Support Portal
        </h1>
        <p className="text-gray-500 text-sm">Need help? Submit a ticket and our team will get back to you shortly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {submitted ? (
            <Card className="border-0 shadow-lg rounded-[2rem] bg-white p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Ticket Submitted!</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
                  We've received your request and a member of our support team will review it shortly. You'll receive an update via email.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => { setSubmitted(false); setSubject(""); setMessage(""); }}
                  className="rounded-xl px-8 h-12 font-bold border-gray-200"
                >
                  Submit another ticket
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="border-0 shadow-lg rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="p-8 md:p-10 pb-0">
                <CardTitle className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-[#008080]" />
                  How can we help?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-bold text-gray-700">Subject</Label>
                    <Input 
                      id="subject"
                      placeholder="e.g. Trouble accessing module 2" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-bold text-gray-700">Message</Label>
                    <textarea 
                      id="message"
                      placeholder="Please describe your issue in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="flex min-h-[200px] w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm ring-offset-background focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2 transition-all"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full h-14 bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#008080]/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {submitting ? "Sending..." : (
                      <span className="flex items-center gap-2">
                        Submit Ticket <Send className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-md rounded-[1.5rem] bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-[#008080]" />
                Support Info
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5F5] flex items-center justify-center text-[#008080] flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Response Time</p>
                    <p className="text-xs text-gray-500 font-medium">We typically respond within 24 hours.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5F5] flex items-center justify-center text-[#008080] flex-shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Office Hours</p>
                    <p className="text-xs text-gray-500 font-medium">Mon - Fri, 9am - 5pm GMT</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <p className="text-xs text-gray-400 font-medium text-center">
                  Direct Email: support@openlead-academy.com
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md rounded-[1.5rem] bg-gray-900 text-white overflow-hidden">
            <CardContent className="p-6 space-y-4 text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Help Articles</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Check our knowledge base for instant answers to common questions before submitting a ticket.
              </p>
              <a 
                href="/dashboard/help"
                className="flex items-center justify-center h-10 w-full bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                Go to Help Centre
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
