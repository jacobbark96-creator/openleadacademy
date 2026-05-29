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
    <div className="max-w-4xl mx-auto px-4 space-y-10 pb-20">
      <div className="space-y-4 text-center pt-4">
        <p className="text-[#008080] font-bold tracking-widest uppercase text-xs sm:text-sm">{lesson.modules.title}</p>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">{lesson.title}</h1>
      </div>

      <div className="relative group mx-auto w-full">
        <Card className="border-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[2.5rem] overflow-hidden bg-black aspect-video relative ring-1 ring-gray-100 transition-transform duration-500 group-hover:scale-[1.01]">
          {lesson.video_url && getEmbedUrl(lesson.video_url) ? (
            <iframe
              src={getEmbedUrl(lesson.video_url)!}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center flex-col text-white">
              <PlayCircle className="w-20 h-20 text-gray-800 mb-4 opacity-20" />
              <p className="font-medium text-lg text-gray-500">No video available</p>
            </div>
          )}
        </Card>
      </div>

      <div className="max-w-2xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-white rounded-[2rem] shadow-xl border border-gray-50 gap-6">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-gray-900 text-xl tracking-tight">Finished watching?</h3>
            <p className="text-sm text-gray-500 mt-1.5 font-medium">
              {quizId ? "Mark as complete to start the module test." : "Mark as complete to finish this lesson."}
            </p>
          </div>
          <Button 
            onClick={handleComplete}
            disabled={completed || saving}
            className={`rounded-2xl h-14 px-12 text-base font-bold shadow-xl transition-all ${
              completed 
                ? "bg-green-500 hover:bg-green-600 text-white cursor-default" 
                : "bg-[#008080] hover:bg-[#006666] text-white hover:scale-105 active:scale-95"
            }`}
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : completed ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Completed
              </>
            ) : (
              "Mark as Complete"
            )}
          </Button>
        </div>

        <Card className="border-0 shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-10 md:p-16">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF5F5] flex items-center justify-center text-[#008080] shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Course Content</h3>
            </div>
            
            <div className="prose prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-a:text-[#008080] prose-lg">
              <div className="text-xl leading-relaxed whitespace-pre-wrap font-medium text-gray-600/90">
                {lesson.description || "No content available for this lesson."}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
