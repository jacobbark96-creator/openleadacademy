import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, PlayCircle, ChevronRight, FileText, Trophy, Calendar, Star, BookOpen, CheckSquare, CheckCircle, Megaphone, Video } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

interface Lesson {
  id: string;
  title: string;
  description: string;
  week_number: number;
  image_url?: string;
  module_id: string;
  order_index: number;
  has_homework?: boolean;
  homework_type?: 'link' | 'upload';
}

interface HomeworkSubmission {
  lesson_id: string;
  submission_url: string;
  created_at: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  video_url?: string;
  image_url?: string;
  order_index: number;
  lessons: Lesson[];
  status: 'completed' | 'unlocked' | 'locked';
  quiz_id?: string;
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

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  // Supabase state
  const [modules, setModules] = useState<Module[]>([])
  const [progressData, setProgressData] = useState<Progress[]>([])
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([])
  const [currentCourse, setCurrentCourse] = useState<any>(null)
  const [homeworkDue, setHomeworkDue] = useState<Lesson[]>([])
  const [submittingHomework, setSubmittingHomework] = useState<string | null>(null)
  const [homeworkLink, setHomeworkLink] = useState("")
  const [homeworkFile, setHomeworkFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [role, setRole] = useState<string>("student")
  
  const handleHomeworkSubmit = async (lesson: Lesson) => {
    if (lesson.homework_type === 'link' && !homeworkLink) {
      toast.error("Please paste your homework link")
      return
    }
    if (lesson.homework_type === 'upload' && !homeworkFile) {
      toast.error("Please select a file to upload")
      return
    }

    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      let submissionUrl = homeworkLink

      if (lesson.homework_type === 'upload' && homeworkFile) {
        const fileExt = homeworkFile.name.split('.').pop()
        const fileName = `${user.id}/${lesson.id}-${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('homework')
          .upload(fileName, homeworkFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('homework')
          .getPublicUrl(fileName)
        
        submissionUrl = publicUrl
      }

      const { error } = await supabase
        .from('homework_submissions')
        .insert({
          lesson_id: lesson.id,
          user_id: user.id,
          submission_type: lesson.homework_type,
          submission_url: submissionUrl,
          company_id: currentCourse?.company_id
        })

      if (error) throw error

      toast.success("Homework submitted successfully!")
      setHomeworkDue(prev => prev.filter(l => l.id !== lesson.id))
      setSubmittingHomework(null)
      setHomeworkLink("")
      setHomeworkFile(null)
    } catch (err: any) {
      console.error("Submission error:", err)
      toast.error(err.message || "Failed to submit homework")
    } finally {
      setIsSubmitting(false)
    }
  }

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
          // Fetch user role and company_id
          const { data: profile } = await supabase.from('profiles').select('role, company_id').eq('id', session.user.id).single()
          if (profile) {
            setRole(profile.role)
          }

          // Fetch enrolled courses for the current user
          let { data: enrollmentData, error: enrollError } = await supabase
            .from('course_enrollments')
            .select('course_id, courses(*)')
            .eq('user_id', session.user.id)
          
          if (enrollError) throw enrollError

          // Auto-enrollment logic
          if (profile?.company_id && profile.role !== 'admin') {
            const { data: autoCourses } = await supabase
              .from('courses')
              .select('*')
              .eq('company_id', profile.company_id)
              .eq('auto_assign', true)
              .order('auto_assign_rank', { ascending: true })

            if (autoCourses && autoCourses.length > 0) {
              const enrolledCourseIds = enrollmentData?.map(e => e.course_id) || []
              let shouldEnrollIn = null

              if (enrolledCourseIds.length === 0) {
                // Not enrolled in any course, enroll in the first auto-assigned course
                shouldEnrollIn = autoCourses[0]
              } else {
                // Check if the latest enrolled auto-course is completed
                // Actually, doing this fully here requires knowing if the current course is complete.
                // We'll calculate course completion below, and if complete, we can trigger the next enrollment.
              }

              if (shouldEnrollIn) {
                const { error: insertError } = await supabase
                  .from('course_enrollments')
                  .insert({
                    user_id: session.user.id,
                    course_id: shouldEnrollIn.id
                  })
                if (!insertError) {
                  // Refresh enrollment data
                  const { data: newEnrollmentData } = await supabase
                    .from('course_enrollments')
                    .select('course_id, courses(*)')
                    .eq('user_id', session.user.id)
                  if (newEnrollmentData) enrollmentData = newEnrollmentData
                }
              }
            }
          }

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

                 // 5. Fetch homework submissions
                 const { data: submissions } = await supabase
                   .from('homework_submissions')
                   .select('lesson_id')
                   .eq('user_id', session.user.id)

                 // 6. Fetch quizzes to link them to lessons or modules
                 const { data: quizData } = await supabase
                   .from('quizzes')
                   .select('id, lesson_id, module_id')
                   .or(`lesson_id.in.(${(lessonData || []).map(l => l.id).join(',')}),module_id.in.(${moduleIds.join(',')})`)

                 if (mounted) {
                   const progress = (userProgress as Progress[]) || []
                   const quizResults = (attempts as QuizAttempt[]) || []
                   const quizzes = quizData || []
                   const allLessons = (lessonData as Lesson[]) || []
                   const homeworkSubmissions = (submissions as { lesson_id: string }[]) || []
                   
                   // Calculate homework due
                   const due = allLessons.filter(lesson => {
                     if (!lesson.has_homework) return false
                     
                     // Check if lesson is completed
                     const isLessonCompleted = progress.some(p => p.lesson_id === lesson.id && p.completed)
                     if (!isLessonCompleted) return false
                     
                     // Check if already submitted
                     const alreadySubmitted = homeworkSubmissions.some(s => s.lesson_id === lesson.id)
                     return !alreadySubmitted
                   })
                   setHomeworkDue(due)
                   
                   // Group lessons by module and calculate status
                   let allModulesCompleted = true
                   const processedModules = moduleData.map((mod, idx) => {
                     const modLessons = allLessons.filter(l => l.module_id === mod.id)
                     const modQuiz = quizzes.find(q => q.module_id === mod.id)
                     
                     // 1. All lessons must be completed
                     const lessonsFinished = modLessons.length > 0 && modLessons.every(lesson => {
                       const lp = progress.find(p => p.lesson_id === lesson.id)
                       if (!lp?.completed) return false
                       
                       // Check lesson quiz if exists
                       const quiz = quizzes.find(q => q.lesson_id === lesson.id)
                       if (quiz) {
                         return quizResults.some(a => a.quiz_id === quiz.id && a.passed)
                       }
                       return true
                     })
 
                     // 2. Module quiz must be passed if it exists
                     let moduleQuizPassed = true
                     if (modQuiz) {
                       moduleQuizPassed = quizResults.some(a => a.quiz_id === modQuiz.id && a.passed)
                     }

                     const isCompleted = lessonsFinished && moduleQuizPassed

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
                       quiz_id: modQuiz?.id,
                       status
                     }
                   })

                   setModules(processedModules)
                  setProgressData(progress)
                  setQuizAttempts(quizResults)

                  // Auto-enroll in next course if current course is completed
                  if (allModulesCompleted && enrolledCourse.auto_assign && profile?.company_id && profile.role !== 'admin') {
                    const { data: nextCourses } = await supabase
                      .from('courses')
                      .select('*')
                      .eq('company_id', profile.company_id)
                      .eq('auto_assign', true)
                      .gt('auto_assign_rank', enrolledCourse.auto_assign_rank || 0)
                      .order('auto_assign_rank', { ascending: true })
                      .limit(1)

                    if (nextCourses && nextCourses.length > 0) {
                      const nextCourse = nextCourses[0]
                      const { data: existingEnrollment } = await supabase
                        .from('course_enrollments')
                        .select('id')
                        .eq('user_id', session.user.id)
                        .eq('course_id', nextCourse.id)
                        .maybeSingle()

                      if (!existingEnrollment) {
                        await supabase
                          .from('course_enrollments')
                          .insert({
                            user_id: session.user.id,
                            course_id: nextCourse.id
                          })
                        toast.success(`Congratulations! You have completed ${enrolledCourse.title} and have been automatically enrolled in ${nextCourse.title}.`)
                      }
                    }
                  }
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

  if (role === 'admin') {
    return (
      <div className="flex flex-col h-full lg:overflow-hidden pb-4">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <Trophy className="w-16 h-16 text-primary mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to your Academy!</h1>
          <p className="text-gray-500 max-w-md mb-8">
            Your academy is ready to go. You can start setting up your brand, creating courses, and inviting your team or students.
          </p>
          <div className="flex gap-4">
            <Link to="/dashboard/settings">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-6">
                Customize Brand
              </Button>
            </Link>
            <Link to="/dashboard/admin">
              <Button variant="outline" className="font-bold px-6">
                Go to Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full lg:overflow-hidden pb-4">
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_280px] gap-4 xl:gap-6 min-h-0 lg:overflow-hidden">
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
                      className="text-primary transition-all duration-1000 ease-out" 
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
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-medium text-gray-500">{completedModules} of {totalModules} modules completed</p>
                      <Link to="/dashboard/progress">
                        <Button variant="ghost" className="px-0 text-primary hover:bg-transparent hover:text-primary/90 font-semibold flex items-center gap-1 h-auto py-0 text-xs">
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
              <Button variant="ghost" className="text-primary font-semibold hover:bg-gray-100 rounded-md h-7 px-3 text-[11px]">
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
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white z-10 shadow-sm">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      ) : module.status === 'unlocked' ? (
                        <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center text-primary z-10 bg-white shadow-sm">
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
                    <Card className={`flex-1 border border-gray-100 shadow-sm bg-white rounded-xl overflow-hidden hover:border-primary/30 transition-colors ${module.status === 'locked' ? 'opacity-75' : ''}`}>
                      <div className="flex flex-col sm:flex-row p-3 gap-3 sm:items-center">
                        {/* Mobile Top Row: Thumbnail + Info */}
                        <div className="flex flex-row items-start gap-3 flex-1 min-w-0">
                          {/* Thumbnail */}
                          <div className={`w-[100px] sm:w-[120px] h-[60px] sm:h-[68px] rounded-lg flex-shrink-0 overflow-hidden relative ${module.status !== 'locked' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                            {module.status !== 'locked' ? (
                              <>
                                {module.image_url ? (
                                  <img 
                                    src={module.image_url} 
                                    alt={module.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                                  />
                                ) : (
                                  <div className="absolute inset-0 bg-slate-800 opacity-40"></div>
                                )}
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
                        </div>

                        {/* Actions/Status */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center min-w-[100px] gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50 sm:pl-2 w-full sm:w-auto mt-2 sm:mt-0">
                          {module.video_url && module.status !== 'locked' && (
                            <Dialog>
                              <DialogTrigger render={<Button variant="ghost" size="sm" className="h-7 text-[10px] text-primary hover:bg-primary/10 font-semibold gap-1" />}>
                                  <Video className="w-3 h-3" /> Watch Intro
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black border-0">
                                <DialogHeader className="p-4 bg-white border-b">
                                  <DialogTitle>{module.title} - Introduction</DialogTitle>
                                </DialogHeader>
                                <div className="aspect-video">
                                    {module.video_url && getEmbedUrl(module.video_url) ? (
                                      <iframe
                                        src={getEmbedUrl(module.video_url)!}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                                        Invalid video URL
                                      </div>
                                    )}
                                  </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          {module.status === 'completed' && (
                            <>
                              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Completed</span>
                              <div className="flex items-center gap-1 text-[9px] text-primary font-medium hidden sm:flex">
                                <CheckCircle className="w-3 h-3" /> Test passed
                              </div>
                            </>
                          )}
                          {module.status === 'unlocked' && (
                            <>
                              {module.quiz_id && module.lessons.every(l => progressData.find(p => p.lesson_id === l.id)?.completed) && !quizAttempts.find(a => a.quiz_id === module.quiz_id)?.passed ? (
                                <Link to={`/dashboard/quizzes/${module.quiz_id}`} className="w-full sm:w-auto">
                                  <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-3 h-7 font-semibold w-full text-[10px] shadow-sm">
                                    Take Module Quiz
                                  </Button>
                                </Link>
                              ) : (
                                <Link to={module.lessons.length > 0 ? `/dashboard/lessons/${module.lessons[0].id}` : '#'} className="w-full sm:w-auto">
                                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-md px-3 h-7 font-semibold w-full text-[10px] shadow-sm">
                                    {module.lessons.length > 0 ? 'Start Module' : 'No Lessons'}
                                  </Button>
                                </Link>
                              )}
                              <div className="flex items-center gap-1 text-[9px] text-primary font-medium hidden sm:flex mt-0.5">
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
          <Card className="flex-none border-0 shadow-sm rounded-xl bg-primary/10 overflow-hidden">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/10">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 mb-0.5">Keep it up!</h3>
                <p className="text-[10px] text-gray-600 leading-snug">You're on track to complete the program.</p>
              </div>
            </CardContent>
          </Card>

          {/* Announcements / Homework Due Panel */}
          <div className="flex-none space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-gray-900">
                {homeworkDue.length > 0 ? "Homework Due" : "Announcements"}
              </h3>
              {homeworkDue.length === 0 && (
                <Link to="/dashboard/announcements" className="text-[10px] font-semibold text-primary hover:underline">View all</Link>
              )}
            </div>
            <Card className="border border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-4 space-y-4">
                {homeworkDue.length > 0 ? (
                  homeworkDue.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between gap-2.5">
                      <div className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-[11px] line-clamp-1">{lesson.title}</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">Homework pending</p>
                        </div>
                      </div>
                      
                      <Dialog open={submittingHomework === lesson.id} onOpenChange={(open) => setSubmittingHomework(open ? lesson.id : null)}>
                        <DialogTrigger render={<Button size="sm" className="h-7 px-3 text-[10px] bg-primary hover:bg-primary/90 text-white font-bold rounded-lg" />}>
                            Turn In
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-bold">Turn In Homework</DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">Submit your work for "{lesson.title}"</p>
                          </DialogHeader>
                          <div className="py-4 space-y-4">
                            {lesson.homework_type === 'link' ? (
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700">Homework Link</label>
                                <input 
                                  type="url"
                                  placeholder="https://..."
                                  value={homeworkLink}
                                  onChange={(e) => setHomeworkLink(e.target.value)}
                                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                                <p className="text-[10px] text-gray-400">Paste the link to your Google Doc, Figma, or other online work.</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700">Upload File</label>
                                <div className="border-2 border-dashed border-gray-100 rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer relative">
                                  <input 
                                    type="file"
                                    onChange={(e) => setHomeworkFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                      <FileText className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs font-medium text-gray-600">
                                      {homeworkFile ? homeworkFile.name : "Click to select a file"}
                                    </p>
                                    <p className="text-[10px] text-gray-400">PDF, ZIP, or Image (Max 10MB)</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSubmittingHomework(null)} className="text-xs font-bold">Cancel</Button>
                            <Button 
                              size="sm" 
                              disabled={isSubmitting}
                              onClick={() => handleHomeworkSubmit(lesson)} 
                              className="text-xs font-bold bg-primary hover:bg-primary/90 text-white"
                            >
                              {isSubmitting ? "Submitting..." : "Submit Homework"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                        <Megaphone className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-[11px]">Welcome to the Openlead Academy!</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">Kick off your learning journey.</p>
                        <p className="text-[9px] text-gray-400 mt-1">2 days ago</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
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
                  </>
                )}
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
                      <BookOpen className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary transition-colors" />
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
                      <CheckSquare className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary transition-colors" />
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
                      <FileText className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary transition-colors" />
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
        <div className="bg-primary/10/90 backdrop-blur-md border border-primary/20 text-gray-900 p-2.5 px-4 rounded-xl flex items-center justify-between shadow-sm pointer-events-auto max-w-[800px] mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-primary/30 flex items-center justify-center text-primary bg-white shadow-sm">
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
