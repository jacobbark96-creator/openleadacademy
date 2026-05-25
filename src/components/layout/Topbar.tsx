"use client"

import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./Sidebar"

export function Topbar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (mounted) {
        setUser(session?.user || null)
      }
    }
    loadUser()
    return () => { mounted = false; }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student'

  const isDashboardHome = pathname === '/dashboard'

  return (
    <header className="flex h-16 md:h-20 items-center justify-between bg-white md:bg-transparent border-b md:border-b-0 px-4 md:px-8 shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          <SheetTrigger>
            <div className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 md:hidden cursor-pointer text-gray-700">
              <Menu className="h-5 w-5" />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[240px]">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 hidden md:flex flex-col">
        {isDashboardHome && user && (
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              Welcome back, {firstName}! <span className="text-lg">👋</span>
            </h1>
            <p className="text-gray-500 text-[11px] font-medium">You&apos;re on track. Keep learning and keep growing.</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="relative rounded-full text-gray-500 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#008080]" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-50 p-1.5 pr-3 rounded-full transition-colors outline-none">
            <Avatar className="h-8 w-8 md:h-9 md:w-9 bg-gray-900 text-white">
              <AvatarFallback className="bg-gray-900 text-white font-medium text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-[13px] md:text-sm font-medium text-gray-700 hidden sm:block">
              {user?.user_metadata?.full_name || 'Loading...'}
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hidden sm:block"><path d="m6 9 6 6 6-6"/></svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
