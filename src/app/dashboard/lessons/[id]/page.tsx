"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LessonPage() {
  const router = useRouter()
  const [completed, setCompleted] = useState(false)

  const handleComplete = () => {
    setCompleted(true)
    toast.success("Lesson marked as complete!")
    setTimeout(() => {
      router.push("/dashboard/quizzes/1")
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Cold Calling 101</h1>
        <p className="text-gray-500 text-lg">Module 2: Prospecting Mastery</p>
      </div>

      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-black aspect-video relative">
        {/* Placeholder for YouTube Embed */}
        <div className="absolute inset-0 flex items-center justify-center flex-col text-white">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-red-700 transition-colors">
            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="font-medium text-lg">YouTube Player Embed</p>
        </div>
      </Card>

      <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="font-bold text-gray-900">Finished watching?</h3>
          <p className="text-sm text-gray-500 mt-1">Mark as complete to unlock the module quiz.</p>
        </div>
        <Button 
          onClick={handleComplete}
          disabled={completed}
          className={`rounded-xl h-11 px-8 ${completed ? "bg-green-500 hover:bg-green-600 text-white" : "text-white"}`}
        >
          {completed ? (
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
          <p className="text-gray-600">
            In this lesson, we cover the fundamentals of cold calling. We&apos;ll explore the psychology of the buyer, how to craft a compelling opening hook, and the importance of tonality.
          </p>
          <ul className="text-gray-600 list-disc pl-5 mt-4 space-y-2">
            <li>The 3-second rule for opening a call</li>
            <li>Pattern interrupts and why they work</li>
            <li>Handling the initial &quot;I&apos;m busy&quot; objection</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
