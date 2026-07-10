import { useState, useEffect } from "react"
import { PublicHeader } from "@/components/layout/PublicHeader"
import { PublicFooter } from "@/components/layout/PublicFooter"
import SEO from "@/components/SEO"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, Briefcase, MapPin, Building } from "lucide-react"

type Vacancy = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  remote_hybrid: string;
  description: string;
  is_active: boolean;
  created_at: string;
};

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVacancies() {
      try {
        const { data, error } = await supabase
          .from('vacancies')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error(error)
        } else {
          setVacancies(data || [])
        }
      } catch (err) {
        console.error("Error fetching vacancies:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchVacancies()
  }, [])

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <SEO 
        title="Exclusive Opportunities" 
        description="Explore elite career opportunities at Openlead Academy's partner companies."
      />
      <PublicHeader />
      
      <main className="pt-48 pb-20 relative">
        <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden z-0">
          <img 
            src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury+modern+office+glass+architecture+skyline+view+dark+blue+tones+teal+lighting&image_size=landscape_16_9" 
            className="w-full h-full object-cover opacity-20"
            alt="Opportunities Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617]" />
        </div>
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
              Careers Portal
            </h1>
            <p className="text-xl text-slate-400 font-medium">
              Direct access to the world's most aggressive revenue teams.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-8">
              {vacancies.map((job) => (
                <Card key={job.id} className="bg-white/5 border-white/10 hover:border-primary/30 transition-all rounded-[32px] overflow-hidden group">
                  <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <h2 className="text-3xl font-black text-white tracking-tight">{job.title}</h2>
                         <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                           {job.type}
                         </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-primary" />
                          {job.remote_hybrid}
                        </div>
                      </div>
                      <p className="text-slate-400 mt-6 max-w-2xl leading-relaxed">{job.description}</p>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end gap-4">
                      <ApplicationModal vacancy={job} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}

function ApplicationModal({ vacancy }: { vacancy: Vacancy }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ fullName: "", email: "", cvUrl: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate application submission via server action or direct insert
    const { error } = await supabase.from('job_applications').insert([
      {
        vacancy_id: vacancy.id,
        full_name: formData.fullName,
        email: formData.email,
        cv_url: formData.cvUrl,
        status: 'pending'
      }
    ])

    if (error) {
      toast.error("Failed to submit application.")
    } else {
      toast.success("Application submitted successfully!")
      setOpen(false)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="rounded-xl px-8 text-white shadow-[0_4px_14px_hsl(var(--primary)/0.2)] hover:shadow-[0_6px_20px_hsl(var(--primary)/0.3)] transition-all bg-gradient-to-r from-primary to-primary/80 hover:scale-[1.02] border border-transparent font-bold">Apply Now</Button>
        }
      />
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Apply for {vacancy.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              required 
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
              className="rounded-xl"
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
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvUrl">LinkedIn Profile or CV Link</Label>
            <Input 
              id="cvUrl" 
              type="url" 
              required 
              value={formData.cvUrl}
              onChange={e => setFormData({...formData, cvUrl: e.target.value})}
              className="rounded-xl"
            />
          </div>
          <Button type="submit" className="w-full rounded-xl h-12 text-white shadow-[0_4px_14px_hsl(var(--primary)/0.2)] hover:shadow-[0_6px_20px_hsl(var(--primary)/0.3)] transition-all bg-gradient-to-r from-primary to-primary/80 hover:scale-[1.02] border border-transparent font-bold text-[15px]" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Submit Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
