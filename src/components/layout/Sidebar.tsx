"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/Logo"
import {
  Home,
  BookOpen,
  FileText,
  CheckSquare,
  BarChart2,
  Award,
  Megaphone,
  FolderOpen,
  HelpCircle,
  Headphones,
  Settings,
  ArrowRight,
  ShieldAlert
} from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const sidebarNavItems = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "My Learning", href: "/dashboard/learning", icon: BookOpen },
  { title: "Library", href: "/dashboard/library", icon: FileText },
  { title: "Quizzes", href: "/dashboard/quizzes", icon: CheckSquare },
  { title: "Progress", href: "/dashboard/progress", icon: BarChart2 },
  { title: "Certificates", href: "/dashboard/certificates", icon: Award },
  { title: "Announcements", href: "/dashboard/announcements", icon: Megaphone },
  { title: "Resources", href: "/dashboard/resources", icon: FolderOpen },
  { title: "Help Centre", href: "/dashboard/help", icon: HelpCircle },
  { title: "Support", href: "/dashboard/support", icon: Headphones },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const supabase = createClient()
  const [role, setRole] = useState<string>("student")

  useEffect(() => {
    async function getUserRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile) {
          setRole(profile.role)
        }
      }
    }
    getUserRole()
  }, [supabase])

  return (
    <div className="hidden md:flex h-screen w-[240px] flex-col bg-white border-r border-gray-100 flex-shrink-0">
      <div className="flex h-20 items-center px-6">
        <Link href="/dashboard">
          <Logo className="scale-90 origin-left" />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
        <nav className="grid gap-0.5 px-3">
          {sidebarNavItems.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') ?? false)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#EBF5F5] text-[#008080]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-[#008080]" : "text-gray-500")} strokeWidth={isActive ? 2.5 : 2} />
                {item.title}
              </Link>
            )
          })}
          
          {(role === 'admin' || role === 'trainer') && (
            <>
              <div className="my-2 border-t border-gray-100" />
              <Link
                href="/dashboard/admin"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
                  pathname?.startsWith('/dashboard/admin')
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <ShieldAlert className={cn("h-4 w-4", pathname?.startsWith('/dashboard/admin') ? "text-red-600" : "text-gray-500")} strokeWidth={pathname?.startsWith('/dashboard/admin') ? 2.5 : 2} />
                {role === 'admin' ? 'Admin Panel' : 'Trainer Panel'}
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="p-4">
        <Link href="/dashboard/support" className="block p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EBF5F5] flex items-center justify-center text-[#008080]">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-900">Need help?</p>
              <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                Contact Support <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
