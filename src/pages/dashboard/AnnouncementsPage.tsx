import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Megaphone, Calendar, Clock, User } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  created_by?: string;
  profiles?: {
    full_name: string;
    role: string;
  };
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnnouncements() {
      const { data, error } = await supabase
        .from('announcements')
        .select('*, profiles(full_name, role)')
        .order('created_at', { ascending: false })
      
      if (data) setAnnouncements(data)
      setLoading(false)
    }
    loadAnnouncements()
  }, [])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-1 -mt-2 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          Announcements
        </h1>
        <p className="text-gray-500 text-sm">Stay up to date with the latest news and updates from the academy.</p>
      </div>

      {announcements.length === 0 ? (
        <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
            <Megaphone className="w-12 h-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No announcements</h3>
            <p className="text-sm max-w-sm">There are no new announcements at this time. Check back later!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {announcements.map(ann => (
            <Card key={ann.id} className="border-0 shadow-md rounded-[2rem] overflow-hidden bg-white">
              <div className="flex flex-col md:flex-row">
                {ann.image_url && (
                  <div className="md:w-[300px] lg:w-[400px] flex-shrink-0">
                    <img 
                      src={ann.image_url} 
                      alt={ann.title}
                      className="w-full h-full object-cover min-h-[200px]"
                    />
                  </div>
                )}
                <CardContent className="p-6 md:p-8 flex-1">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-primary mb-4">
                    <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(ann.created_at).toLocaleDateString()}
                    </div>
                    {ann.profiles?.full_name && (
                      <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full">
                        <User className="w-3.5 h-3.5" />
                        {ann.profiles.full_name} ({ann.profiles.role})
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    {ann.title}
                  </h2>
                  
                  <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
                    {ann.content}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
