import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, PlayCircle, ChevronRight, FileText, Trophy, Calendar, Star, BookOpen, CheckSquare, CheckCircle, Megaphone, Video } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Lesson {
  id: string;
  title: string;
  description: string;
  week_number: number;
  thumbnail_url?: string;
  module_id: string;
  order_index: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  video_url?: string;
  order_index: number;
  lessons: Lesson[];
  status: 'completed' | 'unlocked' | 'locked';
}

interface Progress {
  lesson_id: string;
  completed: boolean;
  unlocked: boolean;
}

interface QuizAttempt {
  quiz_id: string;
  passed: boolean;
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedCourseIdFromUrl = searchParams.get('course')
  const [loading, setLoading] = useState(true)

  // Supabase state
  const [modules, setModules] = useState<Module[]>([])
  const [progressData, setProgressData] = useState<Progress[]>([])
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([])
  const [currentCourse, setCurrentCourse] = useState<any>(null)

  useEffect(() => {
    let mounted = true;
    async function loadDashboardData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          if (mounted) {
            setLoading(false)
            navigate('/login')
          }
          return
        }

        if (mounted) {
          // Fetch enrolled courses for the current user
          const { data: enrollmentData, error: enrollError } = await supabase
            .from('course_enrollments')
            .select('course_id, courses(*)')
            .eq('user_id', session.user.id)
          
          if (enrollError) throw enrollError

          // If user is enrolled in at least one course
          if (enrollmentData && enrollmentData.length > 0 && mounted) {
            let enrolledCourse = null
            if (selectedCourseIdFromUrl) {
              const selected = enrollmentData.find(e => e.course_id === selectedCourseIdFromUrl)
              if (selected) enrolledCourse = selected.courses
            }
            
            if (!enrolledCourse) {
              enrolledCourse = enrollmentData[0].courses as any
            }
            
            if (enrolledCourse) {
              setCurrentCourse(enrolledCourse)
              
              // 1. Fetch modules
              const { data: moduleData } = await supabase
                .from('modules')
                .select('*')
                .eq('course_id', enrolledCourse.id)
                .order('order_index', { ascending: true })
                
              if (moduleData && moduleData.length > 0 && mounted) {
                 const moduleIds = moduleData.map((m: { id: string }) => m.id)
                 
                 // 2. Fetch lessons for these modules
                 const { data: lessonData } = await supabase
                   .from('lessons')
                   .select('*')
                   .in('module_id', moduleIds)
                   .order('order_index', { ascending: true })
                   
                 // 3. Fetch user progress
                 const { data: userProgress } = await supabase
                   .from('lesson_progress')
                   .select('*')
                   .eq('user_id', session.user.id)
                   
                 // 4. Fetch quiz attempts
                 const { data: attempts } = await supabase
                   .from('quiz_attempts')
                   .select('quiz_id, passed')
                   .eq('user_id', session.user.id)

                 // 5. Fetch quizzes to link them to lessons
                 const { data: quizData } = await supabase
                   .from('quizzes')
                   .select('id, lesson_id')
                   .in('lesson_id', (lessonData || []).map(l => l.id))

                 if (mounted) {
                   const progress = (userProgress as Progress[]) || []
                   const quizResults = (attempts as QuizAttempt[]) || []
                   const quizzes = quizData || []
                   const allLessons = (lessonData as Lesson[]) || []
                   
                   // Group lessons by module and calculate status
                   let allModulesCompleted = true
                   const processedModules = moduleData.map((mod, idx) => {
                     const modLessons = allLessons.filter(l => l.module_id === mod.id)
                     
                     // A module is completed if all its lessons are completed 
                     // AND if any lesson has a quiz, that quiz must be passed.
                     const isCompleted = modLessons.length > 0 && modLessons.every(lesson => {
                       const lp = progress.find(p => p.lesson_id === lesson.id)
                       if (!lp?.completed) return false
                       
                       // Check quiz if exists
                       const quiz = quizzes.find(q => q.lesson_id === lesson.id)
                       if (quiz) {
                         const attempt = quizResults.find(a => a.quiz_id === quiz.id)
                         return attempt?.passed
                       }
                       return true
                     })

                     // Logic for unlocking: first module is always unlocked, 
                     // others depend on previous being completed.
                     let status: 'completed' | 'unlocked' | 'locked' = 'locked'
                     if (isCompleted) {
                       status = 'completed'
                     } else if (idx === 0 || allModulesCompleted) {
                       status = 'unlocked'
                       allModulesCompleted = false // Next modules will be locked
                     } else {
                       allModulesCompleted = false
                     }

                     return {
                       ...mod,
                       lessons: modLessons,
                       status
                     }
                   })

                   setModules(processedModules)
                   setProgressData(progress)
                   setQuizAttempts(quizResults)
                 }
              }
            }
          } else {
            if (mounted) {
              setModules([])
              setProgressData([])
              setQuizAttempts([])
              setCurrentCourse(null)
            }
          }
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadDashboardData()
    return () => { mounted = false }
  }, [navigate, selectedCourseIdFromUrl])

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading your dashboard...</div>
  }
  
  // Calculate dynamic progress based on modules
  const totalModules = modules.length || 1
  const completedModules = modules.filter(m => m.status === 'completed').length
  const progressPercentage = Math.round((completedModules / totalModules) * 100) || 0

  // Find the first lesson of the current (unlocked but not completed) module
  const currentModule = modules.find(m => m.status === 'unlocked') || modules[0]
  const nextLessonId = currentModule?.lessons?.[0]?.id

  return (
    <div className="flex flex-col h-full overflow-hidden pb-4">
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
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      {currentCourse ? currentCourse.title : "Openlead Academy - Program"}
                    </h3>
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
                      <p className="text-[11px] font-medium text-gray-500">{completedModules} of {totalModules} modules completed</p>
                      <Link to="/dashboard/progress">
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
              {modules.length > 0 ? (
                modules.map((module, idx) => (
                  <div key={module.id} className="flex items-start sm:items-stretch gap-3 group relative">
                    {/* Status Icon & Line */}
                    <div className="w-6 flex flex-col items-center flex-shrink-0 relative pt-3">
                      {module.status === 'completed' ? (
                        <div className="w-5 h-5 rounded-full bg-[#008080] flex items-center justify-center text-white z-10 shadow-sm">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      ) : module.status === 'unlocked' ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[#008080] flex items-center justify-center text-[#008080] z-10 bg-white shadow-sm">
                          <PlayCircle className="w-2.5 h-2.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 z-10 bg-white">
                          <Lock className="w-2.5 h-2.5" />
                        </div>
                      )}
                      {idx !== modules.length - 1 && (
                        <div className="w-px bg-gray-100 absolute top-8 -bottom-3 z-0" />
                      )}
                    </div>

                    {/* Card Content */}
                    <Card className={`flex-1 border border-gray-100 shadow-sm bg-white rounded-xl overflow-hidden hover:border-[#008080]/30 transition-colors ${module.status === 'locked' ? 'opacity-75' : ''}`}>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-2.5 gap-3">
                        {/* Thumbnail */}
                        <div className={`w-full sm:w-[120px] h-[68px] rounded-lg flex-shrink-0 overflow-hidden relative ${module.status !== 'locked' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                          {module.status !== 'locked' ? (
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
                          <h3 className="text-xs font-bold text-gray-900">Module {idx + 1}: {module.title}</h3>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2 pr-2">{module.description}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                             <div className="text-[10px] font-medium text-gray-400">{module.lessons.length} Lessons</div>
                          </div>
                        </div>

                        {/* Actions/Status */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center min-w-[100px] gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50 pl-2">
                          {module.video_url && module.status !== 'locked' && (
                            <Dialog>
                              <DialogTrigger render={<Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#008080] hover:bg-[#EBF5F5] font-semibold gap-1" />}>
                                  <Video className="w-3 h-3" /> Watch Intro
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black border-0">
                                <DialogHeader className="p-4 bg-white border-b">
                                  <DialogTitle>{module.title} - Introduction</DialogTitle>
                                </DialogHeader>
                                <div className="aspect-video">
                                  <iframe
                                    src={module.video_url.replace("watch?v=", "embed/")}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          {module.status === 'completed' && (
                            <>
                              <span className="text-[10px] font-semibold text-[#008080] bg-[#EBF5F5] px-2 py-0.5 rounded-full">Completed</span>
                              <div className="flex items-center gap-1 text-[9px] text-[#008080] font-medium hidden sm:flex">
                                <CheckCircle className="w-3 h-3" /> Test passed
                              </div>
                            </>
                          )}
                          {module.status === 'unlocked' && (
                            <>
                              <Link to={module.lessons.length > 0 ? `/dashboard/lessons/${module.lessons[0].id}` : '#'} className="w-full sm:w-auto">
                                <Button className="bg-[#008080] hover:bg-[#006666] text-white rounded-md px-3 h-7 font-semibold w-full text-[10px] shadow-sm">
                                  {module.lessons.length > 0 ? 'Start Module' : 'No Lessons'}
                                </Button>
                              </Link>
                              <div className="flex items-center gap-1 text-[9px] text-[#008080] font-medium hidden sm:flex mt-0.5">
                                <PlayCircle className="w-3 h-3" /> Current
                              </div>
                            </>
                          )}
                          {module.status === 'locked' && (
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
                ))
              ) : (
                <div className="py-12 text-center flex flex-col items-center justify-center text-gray-500">
                  <BookOpen className="w-12 h-12 mb-4 text-gray-200" />
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    {currentCourse ? "No modules available yet" : "Not enrolled in any course"}
                  </h3>
                  <p className="text-xs max-w-[240px] mx-auto">
                    {currentCourse 
                      ? "This program doesn't have any modules published yet. Check back soon!" 
                      : "You haven't been assigned to a program yet. Contact your administrator to get started."}
                  </p>
                  {!currentCourse && (
                    <Link to="/dashboard/learning" className="mt-4">
                      <Button variant="outline" className="h-8 text-xs font-semibold rounded-lg">
                        View My Learning
                      </Button>
                    </Link>
                  )}
                </div>
              )}
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
                <p className="text-[10px] text-gray-600 leading-snug">You're on track to complete the program.</p>
              </div>
            </CardContent>
          </Card>

          {/* Announcements Panel */}
          <div className="flex-none space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-gray-900">Announcements</h3>
              <Link to="/dashboard/announcements" className="text-[10px] font-semibold text-[#008080] hover:underline">View all</Link>
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
                <Link to="/dashboard/learning">
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
                <Link to="/dashboard/quizzes">
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
                <Link to="/dashboard/resources">
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
