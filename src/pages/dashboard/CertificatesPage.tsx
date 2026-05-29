import { Card, CardContent } from "@/components/ui/card"
import { Award } from "lucide-react"

export default function CertificatesPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-1 -mt-2 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          Certificates
        </h1>
        <p className="text-gray-500 text-sm">View and download your earned credentials.</p>
      </div>

      <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
          <Award className="w-12 h-12 mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-sm max-w-sm">You haven't earned any certificates yet. Complete a full program to earn your first certificate.</p>
        </CardContent>
      </Card>
    </div>
  )
}
