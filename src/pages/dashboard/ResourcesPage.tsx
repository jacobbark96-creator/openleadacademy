import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, Book, Search, Upload, FileText, Loader2, Plus, Trash2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useTenant } from "@/providers/TenantProvider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
  description?: string;
  category?: string;
}

interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  category?: string;
}

export default function ResourcesPage() {
  const { company } = useTenant()
  const [activeTab, setActiveTab] = useState("resources")
  const [resources, setResources] = useState<Resource[]>([])
  const [glossary, setGlossary] = useState<GlossaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [uploading, setUploading] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    async function loadInitialData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        setRole(profile?.role || 'student')
      }
      
      await Promise.all([loadResources(), loadGlossary()])
      setLoading(false)
    }
    loadInitialData()
  }, [])

  async function loadResources() {
    const { data } = await supabase.from('resources').select('*').order('title')
    if (data) setResources(data)
  }

  async function loadGlossary() {
    const { data } = await supabase.from('glossary').select('*').order('term')
    if (data) setGlossary(data)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('company_id', company?.id || '')

    try {
      // In a real implementation, we would call an AI Edge Function here to parse the file
      // For now, we'll simulate the parsing or handle .txt files directly
      if (file.type === 'text/plain') {
        const text = await file.text()
        const lines = text.split('\n').filter(l => l.includes(':'))
        const entries = lines.map(line => {
          const [term, ...defParts] = line.split(':')
          return {
            term: term.trim(),
            definition: defParts.join(':').trim(),
            company_id: company?.id
          }
        })

        if (entries.length > 0) {
          const { error } = await supabase.from('glossary').upsert(entries, { onConflict: 'term,company_id' })
          if (error) throw error
          toast.success(`Imported ${entries.length} glossary terms`)
          loadGlossary()
        } else {
          toast.error("No valid glossary terms found (Format: Term: Definition)")
        }
      } else {
        toast.info("AI Parsing for Word docs coming soon. Please use .txt for now (Format: Term: Definition)")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload glossary")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteGlossary = async (id: string) => {
    if (!confirm("Are you sure you want to delete this term?")) return
    const { error } = await supabase.from('glossary').delete().eq('id', id)
    if (error) toast.error(error.message)
    else {
      setGlossary(glossary.filter(g => g.id !== id))
      toast.success("Term deleted")
    }
  }

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredGlossary = glossary.filter(g => 
    g.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.definition.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 -mt-2 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Resources & Glossary
          </h1>
          <p className="text-gray-500 text-sm">Access training materials and technical terminology.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder={`Search ${activeTab}...`} 
            className="pl-9 h-10 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="resources" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6 bg-white border border-gray-100 p-1 rounded-2xl h-12">
          <TabsTrigger value="resources" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">Resources</TabsTrigger>
          <TabsTrigger value="glossary" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">Glossary</TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
          ) : filteredResources.length === 0 ? (
            <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                <FolderOpen className="w-12 h-12 mb-4 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No resources</h3>
                <p className="text-sm max-w-sm">There are no downloadable resources matching your search.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(res => (
                <Card key={res.id} className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all border border-gray-50 group">
                  <CardContent className="p-5 flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate mb-1">{res.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{res.description || "Training resource"}</p>
                      <a 
                        href={res.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-black text-primary uppercase tracking-wider hover:underline"
                      >
                        Download Resource →
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="glossary">
          <div className="space-y-6">
            {(role === 'admin' || role === 'trainer') && (
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                  <h3 className="font-bold text-gray-900">Manage Glossary</h3>
                  <p className="text-xs text-gray-500">Upload a .txt file (Format: Term: Definition) to import terms.</p>
                </div>
                <div className="flex gap-2">
                  <Input 
                    type="file" 
                    accept=".txt,.doc,.docx" 
                    className="hidden" 
                    id="glossary-upload" 
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <Button 
                    variant="outline" 
                    className="rounded-xl font-bold gap-2"
                    onClick={() => document.getElementById('glossary-upload')?.click()}
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload Glossary
                  </Button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
            ) : filteredGlossary.length === 0 ? (
              <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                  <Book className="w-12 h-12 mb-4 text-gray-300" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No glossary terms</h3>
                  <p className="text-sm max-w-sm">No terms found matching your search.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGlossary.map(item => (
                  <Card key={item.id} className="border-0 shadow-sm rounded-2xl bg-white border border-gray-50 overflow-hidden group">
                    <CardContent className="p-5 flex justify-between gap-4">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-md bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Definition</span>
                        <h4 className="font-extrabold text-gray-900 mb-2 text-lg tracking-tight uppercase">{item.term}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.definition}</p>
                      </div>
                      {(role === 'admin' || role === 'trainer') && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          onClick={() => handleDeleteGlossary(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
