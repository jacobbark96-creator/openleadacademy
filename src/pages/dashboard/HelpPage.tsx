import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle, Search, ChevronRight, Book } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  order_index: number;
}

export default function HelpPage() {
  const [articles, setArticles] = useState<HelpArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null)

  useEffect(() => {
    async function loadArticles() {
      const { data, error } = await supabase
        .from('help_articles')
        .select('*')
        .order('category', { ascending: true })
        .order('order_index', { ascending: true })
      
      if (data) setArticles(data)
      setLoading(false)
    }
    loadArticles()
  }, [])

  const filteredArticles = articles.filter(art => 
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = Array.from(new Set(articles.map(a => a.category)))

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 -mt-2 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            Help Centre
          </h1>
          <p className="text-gray-500 text-sm">Find answers to common questions and learn how to use the platform.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search help articles..." 
            className="pl-9 h-10 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {selectedArticle ? (
        <div className="space-y-6">
          <button 
            onClick={() => setSelectedArticle(null)}
            className="text-primary font-bold text-sm flex items-center gap-2 hover:underline"
          >
            ← Back to Help Centre
          </button>
          <Card className="border-0 shadow-lg rounded-[2rem] overflow-hidden bg-white">
            <CardContent className="p-8 md:p-12">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-[10px] font-bold text-primary shadow-sm uppercase tracking-wider mb-6 inline-block">
                {selectedArticle.category}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight">
                {selectedArticle.title}
              </h2>
              <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                {selectedArticle.content}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {categories.map(cat => {
              const catArticles = filteredArticles.filter(a => a.category === cat)
              if (catArticles.length === 0) return null
              return (
                <div key={cat} className="space-y-4">
                  <h2 className="text-xl font-extrabold text-gray-900 px-2 flex items-center gap-2">
                    <Book className="w-5 h-5 text-primary" />
                    {cat}
                  </h2>
                  <div className="grid gap-3">
                    {catArticles.map(art => (
                      <button
                        key={art.id}
                        onClick={() => setSelectedArticle(art)}
                        className="flex items-center justify-between p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group"
                      >
                        <span className="font-bold text-gray-800 group-hover:text-primary transition-colors">
                          {art.title}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
            
            {filteredArticles.length === 0 && (
              <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                  <HelpCircle className="w-12 h-12 mb-4 text-gray-300" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-sm max-w-sm">We couldn't find any articles matching your search.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <Card className="border-0 shadow-md rounded-[1.5rem] bg-primary text-white overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold">Still need help?</h3>
                <p className="text-sm text-primary/10 leading-relaxed font-medium">
                  Can't find what you're looking for? Our support team is here to help you with any technical or course-related issues.
                </p>
                <a 
                  href="/dashboard/support"
                  className="flex items-center justify-center h-11 w-full bg-white text-primary rounded-xl font-bold text-sm shadow-sm hover:bg-primary/10 transition-colors"
                >
                  Contact Support
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
