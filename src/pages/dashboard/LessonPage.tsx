import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Loader2, PlayCircle, FileText } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"

interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  module_id: string;
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
  const [saving, setSaving] = useState(false)
  const [quizId, setQuizId] = useState<string | null>(null)

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  useEffect(() => {
    async function loadLesson() {
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
            .single()
          
          if (progress?.completed) setCompleted(true)
        }

        // Check if there is a quiz for this lesson
        const { data: quizData } = await supabase
          .from('quizzes')
          .select('id')
          .eq('lesson_id', id)
          .single()
        
        if (quizData) setQuizId(quizData.id)

      } catch (err) {
        console.error("Error loading lesson:", err)
        toast.error("Failed to load lesson")
      } finally {
        setLoading(false)
      }
    }

    if (id) loadLesson()
  }, [id])

  const handleComplete = async () => {
    try {
      setSaving(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: session.user.id,
          lesson_id: id,
          completed: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,lesson_id' })

      if (error) throw error

      setCompleted(true)
      toast.success("Lesson marked as complete!")
      
      if (quizId) {
        toast.info("Taking you to the module test...")
        setTimeout(() => {
          navigate(`/dashboard/quizzes/${quizId}`)
        }, 2000)
      } else {
        setTimeout(() => {
          navigate("/dashboard")
        }, 1500)
      }
    } catch (err) {
      console.error("Error saving progress:", err)
      toast.error("Failed to save progress")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#008080]" />
      </div>
    )
  }

  if (!lesson) {
    return <div className="p-8 text-center text-gray-500">Lesson not found</div>
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 xl:gap-10 items-start">
        {/* Left Column: Video and Title */}
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-2 md:space-y-3">
            <p className="text-[#008080] font-bold tracking-widest uppercase text-xs sm:text-sm">
              {lesson.modules.title}
            </p>
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {lesson.title}
            </h1>
          </div>

          <div className="relative group w-full">
            <Card className="border-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-black aspect-video relative ring-1 ring-gray-100 transition-transform duration-500 group-hover:scale-[1.005]">
              {lesson.video_url && getEmbedUrl(lesson.video_url) ? (
                <iframe
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
        </div>

        {/* Right Column: Actions and Content */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {/* Completion Card */}
          <div className="p-6 bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-lg border border-gray-50 flex flex-col gap-5">
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 text-lg tracking-tight">Finished watching?</h3>
              <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                {quizId ? "Mark as complete to start the module test." : "Mark as complete to finish this lesson."}
              </p>
            </div>
            <Button 
              onClick={handleComplete}
              disabled={completed || saving}
              className={`rounded-xl h-12 w-full text-sm font-bold shadow-md transition-all ${
                completed 
                  ? "bg-green-500 hover:bg-green-600 text-white cursor-default" 
                  : "bg-[#008080] hover:bg-[#006666] text-white hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </div>

          {/* Course Content Card */}
          <Card className="border-0 shadow-lg rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-gray-50">
                <div className="w-8 h-8 rounded-lg bg-[#EBF5F5] flex items-center justify-center text-[#008080] shadow-sm">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Course Content</h3>
              </div>
              
              <div className="prose prose-slate prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-a:text-[#008080]">
                <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium text-gray-600/90">
                  {lesson.description || "No additional notes or content available for this lesson."}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
