"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"



export default function QuizPage() {
  const router = useRouter()
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [submitted, setSubmitted] = useState(false)
  const [passed, setPassed] = useState(false)

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    setSubmitted(true)
    if (selectedAnswer === "c") {
      setPassed(true)
      toast.success("Quiz passed! Next week unlocked.")
    } else {
      setPassed(false)
      toast.error("Incorrect. Review the lesson and try again.")
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Module 2 Quiz</h1>
        <p className="text-gray-500 text-lg">Test your knowledge on Prospecting Mastery</p>
      </div>

      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader className="p-8 pb-0">
          <CardTitle className="text-xl text-gray-900 leading-relaxed">
            Question 1: What is the most effective way to handle the initial &quot;I&apos;m busy&quot; objection during a cold call?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={setSelectedAnswer}
            disabled={submitted}
            className="space-y-4"
          >
            <div className={`flex items-center space-x-3 p-4 rounded-xl border ${submitted && selectedAnswer === 'a' ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-primary/50'}`}>
              <RadioGroupItem value="a" id="r1" />
              <Label htmlFor="r1" className="flex-1 cursor-pointer text-base font-normal">Immediately hang up and call back later</Label>
            </div>
            <div className={`flex items-center space-x-3 p-4 rounded-xl border ${submitted && selectedAnswer === 'b' ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-primary/50'}`}>
              <RadioGroupItem value="b" id="r2" />
              <Label htmlFor="r2" className="flex-1 cursor-pointer text-base font-normal">Argue that your product only takes 2 minutes</Label>
            </div>
            <div className={`flex items-center space-x-3 p-4 rounded-xl border ${submitted && selectedAnswer === 'c' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-primary/50'}`}>
              <RadioGroupItem value="c" id="r3" />
              <Label htmlFor="r3" className="flex-1 cursor-pointer text-base font-normal">Acknowledge their time, use a pattern interrupt, and ask for 30 seconds</Label>
            </div>
            <div className={`flex items-center space-x-3 p-4 rounded-xl border ${submitted && selectedAnswer === 'd' ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-primary/50'}`}>
              <RadioGroupItem value="d" id="r4" />
              <Label htmlFor="r4" className="flex-1 cursor-pointer text-base font-normal">Read your pitch faster</Label>
            </div>
          </RadioGroup>

          <div className="mt-8 pt-8 border-t flex items-center justify-between">
            {submitted ? (
              <div className="flex items-center gap-3">
                {passed ? (
                  <div className="flex items-center text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Correct! You&apos;ve mastered this topic.
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 font-medium bg-red-50 px-4 py-2 rounded-lg">
                    <XCircle className="w-5 h-5 mr-2" />
                    Incorrect. Try again!
                  </div>
                )}
              </div>
            ) : (
              <div />
            )}

            {!submitted ? (
              <Button 
                onClick={handleSubmit} 
                disabled={!selectedAnswer}
                className="rounded-xl h-11 px-8 text-white"
              >
                Submit Answer
              </Button>
            ) : (
              <Button 
                onClick={() => passed ? router.push('/dashboard') : setSubmitted(false)}
                variant={passed ? "default" : "outline"}
                className={`rounded-xl h-11 px-8 ${passed ? 'text-white' : ''}`}
              >
                {passed ? "Continue to Next Week" : "Retry Question"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

