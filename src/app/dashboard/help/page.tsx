"use client"

import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

export default function HelpCentrePage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-1 -mt-2 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          Help Centre
        </h1>
        <p className="text-gray-500 text-sm">Find answers to common questions.</p>
      </div>

      <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
          <HelpCircle className="w-12 h-12 mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Help Centre coming soon</h3>
          <p className="text-sm max-w-sm">We&apos;re currently building out our knowledge base.</p>
        </CardContent>
      </Card>
    </div>
  )
}
