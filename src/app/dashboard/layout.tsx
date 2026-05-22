import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[100dvh] w-full bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar />
        <main className="flex-1 min-h-0 h-full overflow-hidden p-3 md:p-5 lg:p-6 flex flex-col">
          <div className="mx-auto w-full max-w-[1400px] h-full flex flex-col min-h-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
