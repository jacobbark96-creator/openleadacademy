import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Briefcase,
  Settings
} from "lucide-react"

import { Logo } from "@/components/Logo"

const sidebarNavItems = [
  { title: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { title: "Students", href: "/dashboard/admin/students", icon: Users },
  { title: "Curriculum", href: "/dashboard/admin/curriculum", icon: BookOpen },
  { title: "Vacancies", href: "/dashboard/admin/vacancies", icon: Briefcase },
  { title: "Settings", href: "/dashboard/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const { pathname } = useLocation()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gray-900 text-white">
      <div className="flex h-24 items-center px-8 border-b border-gray-800">
        <Link to="/dashboard/admin">
          <Logo className="invert opacity-90" />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="grid gap-1 px-4">
          {sidebarNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
