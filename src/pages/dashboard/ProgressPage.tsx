import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, BookOpen, CheckCircle, Clock, Trophy, ArrowRight, Award } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface CourseProgress {
  id: string;
  title: string;
  image_url?: string;
  total_lessons: number;
  completed_lessons: number;
  percentage: number;
}

export default function ProgressPage() {
  const [courses, setCourses] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalQuizzes: 0,
    certificates: 0
  })

  useEffect(() => {
    async function loadProgress() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Fetch enrolled courses
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('course_id, courses(*)')
        .eq('user_id', session.user.id)

      if (enrollments) {
        const courseData: CourseProgress[] = []
        let totalComp = 0

        for (const enroll of enrollments) {
          const course = enroll.courses as any
          
          // Get all lessons for this course
          const { data: modules } = await supabase
            .from('modules')
            .select('id')
            .eq('course_id', course.id)
          
          const moduleIds = modules?.map(m => m.id) || []
          
          const { count: totalLessons } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .in('module_id', moduleIds)

          // Get completed lessons for this course
          const { data: progress } = await supabase
            .from('lesson_progress')
            .select('lesson_id')
            .eq('user_id', session.user.id)
            .eq('completed', true)
          
          const { data: courseLessons } = await supabase
            .from('lessons')
            .select('id')
            .in('module_id', moduleIds)
          
          const courseLessonIds = courseLessons?.map(l => l.id) || []
          const completedCount = progress?.filter(p => courseLessonIds.includes(p.lesson_id)).length || 0
          
          totalComp += completedCount
          const percentage = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0

          courseData.push({
            id: course.id,
            title: course.title,
            image_url: course.image_url,
            total_lessons: totalLessons || 0,
            completed_lessons: completedCount,
            percentage
          })
        }
        setCourses(courseData)
        
        // Fetch stats
        const { count: quizCount } = await supabase
          .from('quiz_attempts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .eq('passed', true)
        
        const { count: certCount } = await supabase
          .from('certificates')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)

        setStats({
          totalCompleted: totalComp,
          totalQuizzes: quizCount || 0,
          certificates: certCount || 0
        })
      }
      setLoading(false)
    }
    loadProgress()
  }, [])

  if (loading) return <div className="p-8">Loading your progress...</div>

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-1 -mt-2 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          Progress Tracker
        </h1>
        <p className="text-gray-500 text-sm">Detailed view of your learning journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm bg-[#EBF5F5] rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#008080] shadow-sm">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Lessons Completed</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalCompleted}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-[#FFF7ED] rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Quizzes Passed</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-[#F0F9FF] rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Certificates Earned</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.certificates}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Course Progress</h2>
        {courses.length === 0 ? (
          <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
              <BookOpen className="w-12 h-12 mb-4 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No courses found</h3>
              <p className="text-sm max-w-sm">You are not enrolled in any courses yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {courses.map(course => (
              <Card key={course.id} className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden hover:border-[#008080]/30 transition-all">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-stretch">
                    <div className="w-full md:w-48 h-32 bg-gray-100 flex-shrink-0">
                      {course.image_url ? (
                        <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                          <BookOpen className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {course.completed_lessons} / {course.total_lessons} Lessons
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> {course.percentage}% Complete
                            </span>
                          </div>
                        </div>
                        <Link to={`/dashboard?course=${course.id}`}>
                          <Button variant="outline" className="text-[#008080] border-[#008080]/20 hover:bg-[#008080]/5 gap-2">
                            Continue Learning <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                      <div className="mt-4">
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#008080] rounded-full transition-all duration-500" 
                            style={{ width: `${course.percentage}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
