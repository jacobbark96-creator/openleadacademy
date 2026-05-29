import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Loader2, PlayCircle } from "lucide-react"
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{lesson.title}</h1>
        <p className="text-gray-500 text-lg">{lesson.modules.title}</p>
      </div>

      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-black aspect-video relative">
        {lesson.video_url ? (
          <iframe
            src={lesson.video_url.replace("watch?v=", "embed/")}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center flex-col text-white">
            <PlayCircle className="w-20 h-20 text-gray-600 mb-4" />
            <p className="font-medium text-lg text-gray-400">No video available</p>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="font-bold text-gray-900">Finished watching?</h3>
          <p className="text-sm text-gray-500 mt-1">
            {quizId ? "Mark as complete to start the module test." : "Mark as complete to finish this lesson."}
          </p>
        </div>
        <Button 
          onClick={handleComplete}
          disabled={completed || saving}
          className={`rounded-xl h-11 px-8 ${completed ? "bg-green-500 hover:bg-green-600 text-white" : "text-white"}`}
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

      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-8 prose max-w-none">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Lesson Notes</h3>
          <div className="text-gray-600 whitespace-pre-wrap">
            {lesson.description || "No notes available for this lesson."}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
