import { useState, useEffect } from "react"
import { PublicHeader } from "@/components/layout/PublicHeader"
import { PublicFooter } from "@/components/layout/PublicFooter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
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
    const supabase = createClient()
    async function fetchVacancies() {
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
      setLoading(false)
    }
    fetchVacancies()
  }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PublicHeader />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-900 mb-4">
              Careers Portal
            </h1>
            <p className="text-xl text-slate-600 font-medium">
              Discover opportunities at top partner companies hiring from our academy.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {vacancies.map((job) => (
                <Card key={job.id} className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                  <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {job.remote_hybrid}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-4 max-w-2xl">{job.description}</p>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end gap-3">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        {job.type}
                      </Badge>
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
  const supabase = createClient()

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
          <Button className="rounded-xl px-8 text-white shadow-[0_4px_14px_rgba(20,184,166,0.2)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.3)] transition-all bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:scale-[1.02] border border-transparent font-bold">Apply Now</Button>
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
          <Button type="submit" className="w-full rounded-xl h-12 text-white shadow-[0_4px_14px_rgba(20,184,166,0.2)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.3)] transition-all bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:scale-[1.02] border border-transparent font-bold text-[15px]" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Submit Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
