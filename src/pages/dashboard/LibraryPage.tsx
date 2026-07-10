import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Search, Filter, ExternalLink, Download } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"

interface LibraryResource {
  id: string;
  title: string;
  url: string;
  type: string;
  image_url?: string;
  description?: string;
  category?: string;
  created_at: string;
}

export default function LibraryPage() {
  const [resources, setResources] = useState<LibraryResource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadResources() {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setResources(data)
      setLoading(false)
    }
    loadResources()
  }, [])

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 -mt-2 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            Resource Library
          </h1>
          <p className="text-gray-500 text-sm">Browse all available resources and training materials.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search library..." 
            className="pl-9 h-10 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
            <FileText className="w-12 h-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No resources found</h3>
            <p className="text-sm max-w-sm">We couldn't find any resources matching your search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map(res => (
            <Card key={res.id} className="group border-0 shadow-md rounded-[1.5rem] overflow-hidden bg-white transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-100 flex-shrink-0">
                {res.image_url ? (
                  <img 
                    src={res.image_url} 
                    alt={res.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/20">
                    <FileText className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-primary shadow-sm uppercase tracking-wider">
                    {res.category || res.type}
                  </span>
                </div>
              </div>
              <CardContent className="p-5 flex flex-col flex-1">
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {res.description || "No description provided."}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <a 
                    href={res.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm transition-all hover:bg-primary hover:text-white group/btn"
                  >
                    {res.type === 'Link' ? (
                      <>
                        Visit Link <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </>
                    ) : (
                      <>
                        View Resource <Download className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-y-0.5" />
                      </>
                    )}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
