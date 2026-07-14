import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import AuthProvider from "@/components/providers/AuthProvider"
import { OnboardingProvider, useOnboarding } from "@/components/providers/OnboardingProvider"
import { Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

function DashboardContent() {
  const { isComplete, isLoading } = useOnboarding()
  const [userId, setUserId] = useState<string | null>(null)
  const location = useLocation()

  // Heartbeat for presence tracking
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    checkUser()
  }, [])

  useEffect(() => {
    if (!userId) return

    const updatePresence = async () => {
      try {
        await supabase
          .from('user_presence')
          .upsert({
            user_id: userId,
            last_path: location.pathname,
            updated_at: new Date().toISOString(),
            last_seen_at: new Date().toISOString()
          })
      } catch (err) {
        console.error('Error updating presence:', err)
      }
    }

    // Initial update
    updatePresence()

    // Update every 2 minutes
    const interval = setInterval(updatePresence, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [userId, location.pathname])

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className={`flex h-[100dvh] w-full bg-[#F8FAFC] overflow-hidden transition-all duration-300 ${!isComplete ? 'pointer-events-none blur-sm select-none' : ''}`}>
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar />
        <main className="flex-1 min-h-0 h-full overflow-y-auto p-3 md:p-5 lg:p-6 flex flex-col scrollbar-hide">
          <div className="mx-auto w-full max-w-[1400px] flex flex-col min-h-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <DashboardContent />
      </OnboardingProvider>
    </AuthProvider>
  )
}
