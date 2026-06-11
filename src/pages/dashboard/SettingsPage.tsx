import { Card, CardContent } from "@/components/ui/card"
import { Settings, ShieldCheck, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-1 -mt-2 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          Settings
        </h1>
        <p className="text-gray-500 text-sm">Manage your account preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden md:col-span-2">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
            <Settings className="w-12 h-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">General Settings</h3>
            <p className="text-sm max-w-sm">Account settings will be available here soon.</p>
          </CardContent>
        </Card>

        <Link to="/dashboard/legal">
          <Card className="border border-gray-100 shadow-sm bg-white rounded-2xl overflow-hidden hover:border-[#14B8A6]/50 transition-all group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[#14B8A6]/10 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-[#14B8A6]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Legal Agreements</h3>
                    <p className="text-sm text-gray-500">View your signed NDA and agreements</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#14B8A6] group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
