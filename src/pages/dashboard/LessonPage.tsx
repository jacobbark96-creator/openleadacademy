import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, PlayCircle, FileText, Link as LinkIcon, BookOpen } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  audio_url?: string;
  presentation_url?: string;
  module_id: string;
  company_id: string;
  order_index: number;
  has_homework: boolean;
  homework_type?: 'link' | 'upload';
  modules: {
    title: string;
  };
}

export default function LessonPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [quizPassed, setQuizPassed] = useState(false)
  const [homeworkCompleted, setHomeworkCompleted] = useState(false)
  const [homeworkLink, setHomeworkLink] = useState("")
  const [homeworkFile, setHomeworkFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [quizId, setQuizId] = useState<string | null>(null)
  const [nextLessonId, setNextLessonId] = useState<string | null>(null)
  const [moduleQuizId, setModuleQuizId] = useState<string | null>(null)

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  useEffect(() => {
    async function loadLesson() {
      setLoading(true)
      // Reset lesson-specific states for the new ID
      setCompleted(false)
      setQuizPassed(false)
      setHomeworkCompleted(false)
      setQuizId(null)
      setNextLessonId(null)
      setModuleQuizId(null)

      try {
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*, modules(title)')
          .eq('id', id)
          .single()

        if (lessonError) throw lessonError
        setLesson(lessonData as any)

        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const { data: progress } = await supabase
            .from('lesson_progress')
            .select('completed')
            .eq('user_id', session.user.id)
            .eq('lesson_id', id)
            .maybeSingle()
          
          if (progress?.completed) setCompleted(true)

          // Check if homework is completed if it's required
          if (lessonData.has_homework) {
            const { data: homework } = await supabase
              .from('homework_submissions')
              .select('id')
              .eq('user_id', session.user.id)
              .eq('lesson_id', id)
              .maybeSingle()
            
            if (homework) setHomeworkCompleted(true)
          }
        }

        // Check if there is a quiz for this lesson
        const { data: quizData } = await supabase
          .from('quizzes')
          .select('id')
          .eq('lesson_id', id)
          .maybeSingle()
        
        if (quizData) {
          setQuizId(quizData.id)
          
          // Check if user has already passed this quiz
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            const { data: attempt } = await supabase
              .from('quiz_attempts')
              .select('passed')
              .eq('user_id', session.user.id)
              .eq('quiz_id', quizData.id)
              .eq('passed', true)
              .maybeSingle()
            
            if (attempt) setQuizPassed(true)
          }
        }

        // Find next lesson in the same module
        const { data: nextLesson } = await supabase
          .from('lessons')
          .select('id')
          .eq('module_id', lessonData.module_id)
          .gt('order_index', lessonData.order_index)
          .order('order_index', { ascending: true })
          .limit(1)
        
        if (nextLesson && nextLesson.length > 0) {
          setNextLessonId(nextLesson[0].id)
        } else {
          // If no next lesson, check for a module-level quiz
          const { data: modQuiz } = await supabase
            .from('quizzes')
            .select('id')
            .eq('module_id', lessonData.module_id)
            .maybeSingle()
          
          if (modQuiz) setModuleQuizId(modQuiz.id)
        }

      } catch (err) {
        console.error("Error loading lesson:", err)
        toast.error("Failed to load lesson")
      } finally {
        setLoading(false)
      }
    }

    if (id) loadLesson()
  }, [id])

  const handleHomeworkSubmit = async () => {
    if (!lesson) return
    
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

      // Submit homework
      const { error } = await supabase
        .from('homework_submissions')
        .insert({
          lesson_id: lesson.id,
          user_id: user.id,
          submission_type: lesson.homework_type,
          submission_url: submissionUrl,
          company_id: lesson.company_id
        })

      if (error) throw error

        setHomeworkCompleted(true)
        setHomeworkLink("")
        setHomeworkFile(null)
        
        // Auto-complete the lesson after successful homework submission
        if (!completed) {
          const { error: progressError } = await supabase
            .from('lesson_progress')
            .upsert({
              lesson_id: lesson.id,
              user_id: user.id,
              company_id: lesson.company_id,
              completed: true,
              completed_at: new Date().toISOString()
            }, { onConflict: 'user_id,lesson_id' })
            
          if (!progressError) {
            setCompleted(true)
            toast.success("Homework submitted and lesson completed!")
          } else {
            toast.error("Homework submitted, but failed to complete lesson.")
          }
        } else {
          toast.success("Homework submitted successfully!")
        }
      } catch (err: any) {
      console.error("Submission error:", err)
      toast.error(err.message || "Failed to submit homework")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleComplete = async () => {
    if (completed) {
      if (lesson?.has_homework && !homeworkCompleted) {
        toast.error("Please complete and submit your homework before continuing.")
        return
      }
      handleNavigateNext()
      return
    }

    try {
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      if (lesson?.has_homework && !homeworkCompleted) {
        toast.error("Please complete and submit your homework before marking this lesson as complete.")
        return
      }

      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: id,
          company_id: lesson?.company_id,
          completed: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,lesson_id' })

      if (error) throw error

      setCompleted(true)
      toast.success("Lesson marked as complete!")
    } catch (error: any) {
      console.error('Error marking lesson as complete:', error)
      toast.error("Failed to save progress")
    } finally {
      setSaving(false)
    }
  }

  const handleNavigateNext = () => {
    if (quizId && !quizPassed) {
      navigate(`/dashboard/quizzes/${quizId}`)
    } else if (nextLessonId) {
      navigate(`/dashboard/lessons/${nextLessonId}`)
    } else if (moduleQuizId) {
      navigate(`/dashboard/quizzes/${moduleQuizId}`)
    } else {
      navigate("/dashboard")
    }
  }

  if (!lesson && loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 pt-2 md:pt-4 pb-12 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 xl:gap-10 items-start">
          <div className="space-y-6 md:space-y-8">
            <Card className="border-0 shadow-lg rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-gray-100 aspect-video relative animate-pulse" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-3/4" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-[1.5rem]" />
            <Skeleton className="h-60 w-full rounded-[1.5rem]" />
          </div>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return <div className="p-8 text-center text-gray-500">Lesson not found</div>
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 pt-2 md:pt-4 pb-12 md:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 xl:gap-10 items-start">
        {/* Left Column: Video and Title */}
        <div className="space-y-6 md:space-y-8">
          {/* Video Container - Always at the top and aspect-video for stability */}
          <div className="relative group w-full">
            <Card className="border-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-black aspect-video relative ring-1 ring-gray-100 transition-transform duration-500 group-hover:scale-[1.005]">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : null}
              
              {lesson.video_url && getEmbedUrl(lesson.video_url) ? (
                <iframe
                  key={lesson.id}
                  src={getEmbedUrl(lesson.video_url)!}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center flex-col text-white">
                  <PlayCircle className="w-16 h-16 md:w-20 md:h-20 text-gray-800 mb-4 opacity-20" />
                  <p className="font-medium text-lg text-gray-500 text-center px-4">No video available for this lesson</p>
                </div>
              )}
            </Card>
          </div>

          {/* Title and Module info - Moved below video for stability */}
          <div className="space-y-2 md:space-y-3">
            <p className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm">
              {lesson.modules?.title}
            </p>
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {lesson.title}
            </h1>
          </div>
        </div>

        {/* Right Column: Actions and Content */}
          <div className="lg:sticky lg:top-24">
            {/* Consolidated Action and Content Card */}
            <Card className="border-0 shadow-lg rounded-[1.5rem] overflow-hidden bg-white flex flex-col lg:max-h-[calc(100vh-6rem)]">
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-5 md:p-6">
                <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-gray-50">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Course Content</h3>
                </div>
                
                <div className="prose prose-slate prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-a:text-primary">
                  {lesson.audio_url && (
                    <div className="mb-5 rounded-2xl border border-primary/10 bg-primary/10 p-4">
                      <p className="mb-3 text-sm font-semibold text-primary/90">Lesson Audio</p>
                      <audio controls preload="metadata" className="w-full">
                        <source src={lesson.audio_url} />
                        Your browser does not support the audio player.
                      </audio>
                    </div>
                  )}
                  <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium text-gray-600/90">
                    {lesson.description || "No additional notes or content available for this lesson."}
                  </div>
                  
                  {lesson.presentation_url && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">Lesson Presentation</p>
                            <p className="text-xs text-gray-500">Download the presentation file</p>
                          </div>
                        </div>
                        <a 
                          href={lesson.presentation_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors shadow-sm"
                        >
                          Download File
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed Action Area */}
              <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-4 shrink-0">
                {lesson.has_homework && !homeworkCompleted && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg tracking-tight">Homework Required</h3>
                    </div>
                    {lesson.homework_type === 'link' ? (
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input 
                          type="url"
                          placeholder="Paste your homework link here..."
                          value={homeworkLink}
                          onChange={(e) => setHomeworkLink(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none bg-white transition-all shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-orange-200 rounded-xl p-4 text-center hover:border-orange-300 transition-colors cursor-pointer relative bg-white shadow-sm">
                        <input 
                          type="file"
                          onChange={(e) => setHomeworkFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-medium text-gray-600">
                            {homeworkFile ? homeworkFile.name : "Click to select a file"}
                          </p>
                          <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-tight">Max 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {lesson.has_homework && homeworkCompleted && (
                  <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-100">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Homework Submitted & Verified</span>
                  </div>
                )}

                <Button 
                  onClick={() => {
                    if (lesson.has_homework && !homeworkCompleted) {
                      handleHomeworkSubmit()
                    } else if (!completed) {
                      handleComplete()
                    } else {
                      handleNavigateNext()
                    }
                  }}
                  disabled={isSubmitting || saving || loading || (lesson.has_homework && !homeworkCompleted && (lesson.homework_type === 'link' ? !homeworkLink : !homeworkFile))}
                  className={`w-full h-12 text-sm font-bold shadow-md transition-all rounded-xl ${
                    completed || (lesson.has_homework && homeworkCompleted)
                      ? "bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02] active:scale-[0.98]"
                      : lesson.has_homework
                        ? "bg-orange-500 hover:bg-orange-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-orange-200"
                        : "bg-primary hover:bg-primary/90 text-white hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting || saving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : lesson.has_homework && !homeworkCompleted ? (
                    "Submit Homework"
                  ) : completed ? (
                    <>
                      {quizId ? "Start Lesson Quiz" : nextLessonId ? "Next Lesson" : moduleQuizId ? "Start Module Test" : "Back to Dashboard"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    "Complete & Continue"
                  )}
                </Button>
              </div>
            </Card>
          </div>
      </div>
    </div>
  )
}
