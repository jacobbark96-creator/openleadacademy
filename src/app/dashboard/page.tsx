"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, PlayCircle, ChevronRight, FileText, Trophy, Calendar, Star, BookOpen, CheckSquare, CheckCircle, Megaphone } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true)

  // Supabase state
  const [lessons, setLessons] = useState<any[]>([]) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [progressData, setProgressData] = useState<any[]>([]) // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    let mounted = true;
    async function loadDashboardData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (mounted) {
          setLoading(false)
          router.push('/login')
        }
        return
      }

      if (mounted) {
        setUser(session.user)
        
        // Fetch courses
        const { data: courseData } = await supabase.from('courses').select('*')
        
        // Fetch modules for the first course
        if (courseData && courseData.length > 0 && mounted) {
          const firstCourse = courseData[0]
          
          const { data: moduleData } = await supabase
            .from('modules')
            .select('*')
            .eq('course_id', firstCourse.id)
            .order('order_index', { ascending: true })
            
          if (moduleData && moduleData.length > 0 && mounted) {
             const moduleIds = moduleData.map((m: any) => m.id) // eslint-disable-line @typescript-eslint/no-explicit-any
             const { data: lessonData } = await supabase
               .from('lessons')
               .select('*')
               .in('module_id', moduleIds)
               .order('week_number', { ascending: true })
               
             if (mounted) setLessons(lessonData || [])
             
             // Fetch progress
             const { data: userProgress } = await supabase
               .from('lesson_progress')
               .select('*')
               .eq('user_id', session.user.id)
               
             if (mounted) setProgressData(userProgress || [])
          }
        }
      }
      if (mounted) setLoading(false)
    }
    loadDashboardData()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading your dashboard...</div>
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student'
  
  // Calculate dynamic progress
  const totalLessons = lessons.length || 14
  const completedLessons = progressData.filter(p => p.completed).length
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100) || 0

  // Combine lessons with progress
  const curriculum = lessons.map(lesson => {
    const prog = progressData.find(p => p.lesson_id === lesson.id)
    return {
      id: lesson.id,
      week: lesson.week_number,
      title: lesson.title,
      description: lesson.description,
      status: prog?.completed ? 'completed' : prog?.unlocked ? 'unlocked' : 'locked',
      thumbnail: !!lesson.thumbnail_url
    }
  })

  // Fallback curriculum if DB is empty
  const displayCurriculum = curriculum.length > 0 ? curriculum : [
    {
      id: "dummy1",
      week: 1,
      title: "Welcome to Openlead",
      description: "Introduction to our mission, values and the Openlead way.",
      status: "completed",
      thumbnail: true,
    },
    {
      id: "dummy2",
      week: 2,
      title: "Our Products & Services",
      description: "Overview of what we do and how our solutions help our clients succeed.",
      status: "unlocked",
      thumbnail: true,
    },
    {
      id: "dummy3",
      week: 3,
      title: "Working with Customers",
      description: "Best practices for communication, relationship building and delivering value.",
      status: "locked",
      thumbnail: true,
    }
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden pb-4">
      {/* Welcome Section (Fixed top) */}
      <div className="flex-none flex flex-col gap-1 mb-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          Welcome back, {firstName}! <span className="text-xl">👋</span>
        </h1>
        <p className="text-gray-500 text-xs">You&apos;re on track. Keep learning and keep growing.</p>
      </div>

      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_280px] gap-4 xl:gap-6 min-h-0 overflow-y-auto lg:overflow-hidden pr-1 lg:pr-0">
        {/* Main Content Area (Curriculum & Progress) */}
        <div className="flex flex-col min-h-0 space-y-4 lg:overflow-hidden">
          {/* Progress Card (Fixed) */}
          <Card className="flex-none border border-gray-100 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardContent className="p-4 md:p-5">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Circular Progress */}
                <div className="relative w-[90px] h-[90px] flex-shrink-0">
                  <div className="absolute top-[-8px] left-0 right-0 text-center text-[10px] font-semibold text-gray-900">Your Progress</div>
                  <svg className="w-full h-full transform -rotate-90 mt-2" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                    <circle 
                      cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * progressPercentage) / 100}
                      className="text-[#008080] transition-all duration-1000 ease-out" 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 mt-2 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-gray-900 leading-none">{progressPercentage}%</span>
                    <span className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-wider font-semibold">Complete</span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-2 w-full">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">Openlead Academy - Onboarding Program</h3>
                    <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                      <p>Complete quizzes to unlock the next lesson.</p>
                      <p className="hidden sm:block">Stay consistent and keep building your knowledge!</p>
                    </div>
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#008080] rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-medium text-gray-500">{completedLessons} of {totalLessons} lessons completed</p>
                      <Link href="/dashboard/progress">
                        <Button variant="ghost" className="px-0 text-[#008080] hover:bg-transparent hover:text-[#006666] font-semibold flex items-center gap-1 h-auto py-0 text-xs">
                          View My Progress <ArrowRightIcon className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Curriculum Timeline (Scrollable) */}
          <div className="flex-none lg:flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex-none p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-900">Program Curriculum</h2>
              <Button variant="ghost" className="text-[#008080] font-semibold hover:bg-gray-100 rounded-md h-7 px-3 text-[11px]">
                View Full Curriculum
              </Button>
            </div>
            
            <div className="flex-none lg:flex-1 lg:overflow-y-auto p-4 space-y-3">
              {displayCurriculum.map((week, idx) => (
                <div key={week.id} className="flex items-start sm:items-stretch gap-3 group relative">
                  {/* Status Icon & Line */}
                  <div className="w-6 flex flex-col items-center flex-shrink-0 relative pt-3">
                    {week.status === 'completed' ? (
                      <div className="w-5 h-5 rounded-full bg-[#008080] flex items-center justify-center text-white z-10 shadow-sm">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    ) : week.status === 'unlocked' ? (
                      <div className="w-5 h-5 rounded-full border-2 border-[#008080] flex items-center justify-center text-[#008080] z-10 bg-white shadow-sm">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 z-10 bg-white">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}
                    {idx !== displayCurriculum.length - 1 && (
                      <div className="w-px bg-gray-100 absolute top-8 -bottom-3 z-0" />
                    )}
                  </div>

                  {/* Card Content */}
                  <Card className="flex-1 border border-gray-100 shadow-sm bg-white rounded-xl overflow-hidden hover:border-[#008080]/30 transition-colors">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-2.5 gap-3">
                      {/* Thumbnail */}
                      <div className={`w-full sm:w-[120px] h-[68px] rounded-lg flex-shrink-0 overflow-hidden relative ${week.thumbnail ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        {week.thumbnail ? (
                          <>
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                            <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <div className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center pl-0.5 shadow-sm">
                                <PlayCircle className="w-3.5 h-3.5 text-gray-900" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                            <Lock className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 py-0.5">
                        <h3 className="text-xs font-bold text-gray-900">Week {week.week}: {week.title}</h3>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2 pr-2">{week.description}</p>
                      </div>

                      {/* Actions/Status */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center min-w-[100px] gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50 pl-2">
                        {week.status === 'completed' && (
                          <>
                            <span className="text-[10px] font-semibold text-[#008080] bg-[#EBF5F5] px-2 py-0.5 rounded-full">Completed</span>
                            <div className="flex items-center gap-1 text-[9px] text-[#008080] font-medium hidden sm:flex">
                              <CheckCircle className="w-3 h-3" /> Quiz passed
                            </div>
                          </>
                        )}
                        {week.status === 'unlocked' && (
                          <>
                            <Link href={`/dashboard/lessons/${week.id}`} className="w-full sm:w-auto">
                              <Button className="bg-[#008080] hover:bg-[#006666] text-white rounded-md px-3 h-7 font-semibold w-full text-[10px] shadow-sm">
                                Start Lesson
                              </Button>
                            </Link>
                            <div className="flex items-center gap-1 text-[9px] text-[#008080] font-medium hidden sm:flex mt-0.5">
                              <Lock className="w-3 h-3" /> Unlocked
                            </div>
                          </>
                        )}
                        {week.status === 'locked' && (
                          <>
                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Locked</span>
                            <div className="flex items-center gap-1 text-[9px] text-gray-400 text-center leading-tight hidden sm:flex">
                              <Lock className="w-2.5 h-2.5 flex-shrink-0" /> Complete previous
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Area (Scrollable independently) */}
        <div className="flex-none lg:flex flex-col min-h-0 space-y-4 lg:overflow-y-auto pr-1">
          {/* Keep it up Card */}
          <Card className="flex-none border-0 shadow-sm rounded-xl bg-[#EBF5F5] overflow-hidden">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-[#008080]/10">
                <Trophy className="w-5 h-5 text-[#008080]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 mb-0.5">Keep it up!</h3>
                <p className="text-[10px] text-gray-600 leading-snug">You&apos;re on track to complete the program.</p>
              </div>
            </CardContent>
          </Card>

          {/* Announcements Panel */}
          <div className="flex-none space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-gray-900">Announcements</h3>
              <Link href="/dashboard/announcements" className="text-[10px] font-semibold text-[#008080] hover:underline">View all</Link>
            </div>
            <Card className="border border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-4 space-y-4">
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#EBF5F5] flex items-center justify-center flex-shrink-0 text-[#008080]">
                    <Megaphone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-[11px]">Welcome to the Openlead Academy!</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Kick off your learning journey.</p>
                    <p className="text-[9px] text-gray-400 mt-1">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#EBF5F5] flex items-center justify-center flex-shrink-0 text-[#008080]">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-[11px]">Live Q&A Session</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Join us this Friday at 11:00 AM</p>
                    <p className="text-[9px] text-gray-400 mt-1">5 days ago</p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#FCF8E3] flex items-center justify-center flex-shrink-0 text-[#EAB308]">
                    <Star className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-[11px]">New Resource Added</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">Check out the Customer Success Guide.</p>
                    <p className="text-[9px] text-gray-400 mt-1">1 week ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links Panel */}
          <div className="flex-none space-y-2 pb-16 md:pb-0">
            <h3 className="text-xs font-bold text-gray-900 px-1">Quick Links</h3>
            <Card className="border border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-1 flex flex-col">
                <Link href="/dashboard/learning">
                  <Button variant="ghost" className="w-full justify-between h-12 px-3 hover:bg-gray-50 rounded-lg group font-normal">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#008080] transition-colors" />
                      <div className="text-left">
                        <div className="text-[11px] font-semibold text-gray-900">My Learning</div>
                        <div className="text-[9px] text-gray-500">Continue where you left off</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <div className="h-[1px] bg-gray-50 mx-3" />
                <Link href="/dashboard/quizzes">
                  <Button variant="ghost" className="w-full justify-between h-12 px-3 hover:bg-gray-50 rounded-lg group font-normal">
                    <div className="flex items-center gap-2.5">
                      <CheckSquare className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#008080] transition-colors" />
                      <div className="text-left">
                        <div className="text-[11px] font-semibold text-gray-900">Quizzes</div>
                        <div className="text-[9px] text-gray-500">View your quiz history</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <div className="h-[1px] bg-gray-50 mx-3" />
                <Link href="/dashboard/resources">
                  <Button variant="ghost" className="w-full justify-between h-12 px-3 hover:bg-gray-50 rounded-lg group font-normal">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#008080] transition-colors" />
                      <div className="text-left">
                        <div className="text-[11px] font-semibold text-gray-900">Resources</div>
                        <div className="text-[9px] text-gray-500">Helpful documents and guides</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer Notification Bar */}
      <div className="hidden md:flex fixed bottom-4 left-[260px] right-6 z-10 pointer-events-none">
        <div className="bg-[#EBF5F5]/90 backdrop-blur-md border border-[#008080]/20 text-gray-900 p-2.5 px-4 rounded-xl flex items-center justify-between shadow-sm pointer-events-auto max-w-[800px] mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-[#008080]/30 flex items-center justify-center text-[#008080] bg-white shadow-sm">
              <Calendar className="w-3 h-3" />
            </div>
            <p className="text-[11px]"><span className="font-semibold">Stay on track!</span> New lessons unlock every week after you pass the quiz. Keep learning and keep growing!</p>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-black/5 rounded-md h-6 w-6">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
