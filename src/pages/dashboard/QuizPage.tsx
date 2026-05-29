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
  lesson_id: string;
  lessons: {
    title: string;
    module_id: string;
    modules: {
      title: string;
    };
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
          .select('*, lessons(title, module_id, modules(title))')
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
        <Loader2 className="w-8 h-8 animate-spin text-[#008080]" />
      </div>
    )
  }

  if (!quiz || questions.length === 0) {
    return <div className="p-8 text-center text-gray-500">Quiz not found or has no questions</div>
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{quiz.title}</h1>
        <p className="text-gray-500 text-lg">{quiz.lessons.modules.title}: {quiz.lessons.title}</p>
      </div>

      {!submitted ? (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="p-8 pb-0">
            <div className="flex justify-between items-center mb-4">
               <span className="text-xs font-bold text-[#008080] uppercase tracking-wider">Question {currentQuestionIndex + 1} of {questions.length}</span>
               <span className="text-xs font-medium text-gray-400">Passing score: {quiz.passing_score}%</span>
            </div>
            <CardTitle className="text-xl text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <RadioGroup 
              value={selectedAnswers[currentQuestionIndex]?.toString()} 
              onValueChange={(val) => setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: parseInt(val) }))}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                    selectedAnswers[currentQuestionIndex] === idx 
                      ? 'border-[#008080] bg-[#EBF5F5]/50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: idx }))}
                >
                  <RadioGroupItem value={idx.toString()} id={`r${idx}`} />
                  <Label htmlFor={`r${idx}`} className="flex-1 cursor-pointer text-base font-normal">{option}</Label>
                </div>
              ))}
            </RadioGroup>

            <div className="mt-8 pt-8 border-t flex justify-end">
              <Button 
                onClick={handleNext} 
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                className="rounded-xl h-11 px-8 text-white bg-[#008080] hover:bg-[#006666]"
              >
                {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              {passed ? (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <XCircle className="w-10 h-10" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {passed ? "Congratulations! You Passed" : "Quiz Not Passed"}
              </h2>
              <p className="text-gray-500">
                Your score: <span className={`font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>{score}%</span>
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              {passed ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="rounded-xl h-11 px-8 text-white bg-[#008080] hover:bg-[#006666]"
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
                    className="rounded-xl h-11 px-8"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => navigate(`/dashboard/lessons/${quiz.lesson_id}`)}
                    variant="ghost"
                    className="rounded-xl h-11 px-8 text-gray-500"
                  >
                    Review Lesson
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
