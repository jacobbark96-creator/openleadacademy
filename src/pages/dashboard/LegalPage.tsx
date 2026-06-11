import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { ShieldCheck, Calendar, User, FileText, Download } from "lucide-react"
import { NDA_CONTENT, SUBCONTRACTOR_CONTENT } from "@/constants/agreements"
import { Card } from "@/components/ui/card"

export default function LegalPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(data)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading your agreements...</div>
  }

  const agreements = [
    {
      title: "Non-Disclosure Agreement",
      content: NDA_CONTENT,
      signed: profile?.nda_signed,
      signedAt: profile?.nda_signed_at,
      signature: profile?.agreement_signature_name
    },
    {
      title: "Subcontractor Agreement",
      content: SUBCONTRACTOR_CONTENT,
      signed: profile?.subcontractor_signed,
      signedAt: profile?.subcontractor_signed_at,
      signature: profile?.agreement_signature_name
    }
  ]

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Legal Agreements</h1>
        <p className="text-slate-500">Review your signed legal documents and professional commitments.</p>
      </div>

      <div className="grid gap-8">
        {agreements.map((agreement, index) => (
          <motion.div
            key={agreement.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[#14B8A6]/10 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-[#14B8A6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{agreement.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        Signed on {agreement.signedAt ? new Date(agreement.signedAt).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <User className="w-4 h-4" />
                        Signed by {agreement.signature}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20">
                    Officially Executed
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="relative group">
                  <div className="max-h-[300px] overflow-y-auto p-6 bg-slate-50 rounded-xl border border-slate-100 font-sans text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                    {agreement.content}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-50 to-transparent rounded-b-xl pointer-events-none" />
                </div>
                
                <div className="mt-6 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">Digital Copy of Agreement</span>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 text-sm font-bold text-[#14B8A6] hover:text-[#0D9488] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Print / Save PDF
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="p-6 rounded-2xl bg-[#020617] text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-lg font-bold">Need legal assistance?</h3>
          <p className="text-slate-400 text-sm mt-1">Contact our administration for questions regarding these agreements.</p>
        </div>
        <button className="relative z-10 px-6 py-2.5 bg-white text-slate-900 rounded-full font-bold text-sm hover:bg-slate-100 transition-colors">
          Contact Admin
        </button>
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#14B8A6]/10 blur-[80px] -mr-32 -mt-32" />
      </div>
    </div>
  )
}
