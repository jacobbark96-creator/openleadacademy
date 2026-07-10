import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_option_index: number;
}

interface Quiz {
  id: string;
  title: string;
  passing_score: number;
  lesson_id?: string;
  module_id?: string;
  lessons?: {
    title: string;
    module_id: string;
    modules: {
      title: string;
    };
  };
  modules?: {
    title: string;
  };
}

export default function QuizPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [passed, setPassed] = useState(false)
  const [score, setScore] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadQuiz() {
      try {
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*, lessons(title, module_id, modules(title)), modules(title)')
          .eq('id', id)
          .single()

        if (quizError) throw quizError
        setQuiz(quizData as any)

        const { data: questionData, error: questionError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', id)
          .order('order_index', { ascending: true })

        if (questionError) throw questionError
        setQuestions(questionData as Question[])

      } catch (err) {
        console.error("Error loading quiz:", err)
        toast.error("Failed to load quiz")
      } finally {
        setLoading(false)
      }
    }

    if (id) loadQuiz()
  }, [id])

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      calculateResult()
    }
  }

  const calculateResult = async () => {
    let correctCount = 0
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_option_index) {
        correctCount++
      }
    })

    const finalScore = Math.round((correctCount / questions.length) * 100)
    setScore(finalScore)
    const isPassed = finalScore >= (quiz?.passing_score || 80)
    setPassed(isPassed)
    setSubmitted(true)

    try {
      setSaving(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: session.user.id,
          quiz_id: id,
          score: finalScore,
          passed: isPassed
        })

      if (error) throw error

      if (isPassed) {
        toast.success(`Quiz passed with ${finalScore}%!`)
      } else {
        toast.error(`Score: ${finalScore}%. You need ${quiz?.passing_score}% to pass.`)
      }
    } catch (err) {
      console.error("Error saving quiz attempt:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!quiz || questions.length === 0) {
    return <div className="p-8 text-center text-gray-500">Quiz not found or has no questions</div>
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="max-w-4xl mx-auto px-4 pt-2 md:pt-4 pb-12 md:pb-20">
      <div className="space-y-4 text-center">
        {quiz.lessons ? (
          <p className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm">{quiz.lessons.modules.title}: {quiz.lessons.title}</p>
        ) : quiz.modules ? (
          <p className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm">{quiz.modules.title}: Final Module Test</p>
        ) : null}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">{quiz.title}</h1>
      </div>

      {!submitted ? (
        <Card className="border-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="p-10 md:p-16 pb-0">
            <div className="flex justify-between items-center mb-6">
               <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Question {currentQuestionIndex + 1} of {questions.length}</span>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Passing score: {quiz.passing_score}%</span>
            </div>
            <CardTitle className="text-2xl md:text-3xl text-gray-900 leading-relaxed font-extrabold tracking-tight">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 md:p-16">
            <RadioGroup 
              value={selectedAnswers[currentQuestionIndex]?.toString()} 
              onValueChange={(val) => setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: parseInt(val) }))}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedAnswers[currentQuestionIndex] === idx 
                      ? 'border-primary bg-primary/10/50 shadow-md scale-[1.01]' 
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: idx }))}
                >
                  <RadioGroupItem value={idx.toString()} id={`r${idx}`} className="w-5 h-5" />
                  <Label htmlFor={`r${idx}`} className="flex-1 cursor-pointer text-lg font-semibold text-gray-700">{option}</Label>
                </div>
              ))}
            </RadioGroup>

            <div className="mt-12 pt-8 border-t border-gray-50 flex justify-end">
              <Button 
                onClick={handleNext} 
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                className="rounded-2xl h-14 px-12 text-base font-bold text-white bg-primary hover:bg-primary/90 shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-16 md:p-24 text-center space-y-8">
            <div className="flex justify-center">
              {passed ? (
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-inner">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-inner">
                  <XCircle className="w-12 h-12" />
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                {passed ? "Congratulations! You Passed" : "Quiz Not Passed"}
              </h2>
              <p className="text-xl text-gray-500 font-medium">
                Your score: <span className={`font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>{score}%</span>
              </p>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {passed ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="rounded-2xl h-14 px-12 text-base font-bold text-white bg-primary hover:bg-primary/90 shadow-xl hover:scale-105 transition-all"
                >
                  Continue to Next Module
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => {
                      setSubmitted(false)
                      setCurrentQuestionIndex(0)
                      setSelectedAnswers({})
                    }}
                    variant="outline"
                    className="rounded-2xl h-14 px-12 text-base font-bold border-2 hover:bg-gray-50 transition-all"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => {
                      if (quiz.lesson_id) {
                        navigate(`/dashboard/lessons/${quiz.lesson_id}`)
                      } else {
                        navigate('/dashboard')
                      }
                    }}
                    variant="ghost"
                    className="rounded-2xl h-14 px-12 text-base font-bold text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    {quiz.lesson_id ? "Review Lesson" : "Back to Dashboard"}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
