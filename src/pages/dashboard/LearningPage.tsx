import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, PlayCircle, Clock, Trophy } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface Course {
  id: string;
  title: string;
  description: string;
  image_url?: string;
}

interface Enrollment {
  course_id: string;
  enrolled_at: string;
  courses: Course;
}

export default function LearningPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadEnrollments() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const { data, error } = await supabase
          .from('course_enrollments')
          .select('course_id, enrolled_at, courses(*)')
          .eq('user_id', session.user.id)
          .order('enrolled_at', { ascending: false })

        if (error) throw error
        if (mounted) setEnrollments((data as any) || [])
      } catch (err) {
        console.error("Error loading enrollments:", err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadEnrollments()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading your courses...</div>
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-1 -mt-2 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          My Learning
        </h1>
        <p className="text-gray-500 text-sm">Pick up right where you left off.</p>
      </div>

      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.course_id} className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden hover:border-primary/30 transition-all group">
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {enrollment.courses.image_url ? (
                  <img 
                    src={enrollment.courses.image_url} 
                    alt={enrollment.courses.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <BookOpen className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                  {enrollment.courses.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                  {enrollment.courses.description}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      Self-paced
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                      <Trophy className="w-3.5 h-3.5" />
                      Certificate
                    </div>
                  </div>
                </div>
                <Link to={`/dashboard?course=${enrollment.course_id}`} className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-10 font-bold">
                    Continue Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
            <BookOpen className="w-12 h-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No active courses</h3>
            <p className="text-sm max-w-sm">You haven't started any courses yet. Check back once you've been assigned to a program.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
