import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import AuthProvider from "@/components/providers/AuthProvider"
import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <AuthProvider>
      <div className="flex h-[100dvh] w-full bg-[#F8FAFC] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <Topbar />
          <main className="flex-1 min-h-0 h-full overflow-y-auto p-3 md:p-5 lg:p-6 flex flex-col scrollbar-hide">
            <div className="mx-auto w-full max-w-[1400px] flex flex-col min-h-0">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
