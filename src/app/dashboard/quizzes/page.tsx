"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare } from "lucide-react"

export default function QuizzesPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-1 -mt-2 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          Quizzes
        </h1>
        <p className="text-gray-500 text-sm">View your quiz history and upcoming assessments.</p>
      </div>

      <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
          <CheckSquare className="w-12 h-12 mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No quizzes available</h3>
          <p className="text-sm max-w-sm">You don&apos;t have any quiz history or pending quizzes at the moment.</p>
        </CardContent>
      </Card>
    </div>
  )
}
