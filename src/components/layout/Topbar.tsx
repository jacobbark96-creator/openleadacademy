import { Bell, Menu, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase/client"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./Sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Logo } from "@/components/Logo"

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export function Topbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [user, setUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted && session?.user) {
          setUser(session.user)
          
          // Fetch notifications
          const { data: notifs } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(10)
            
          if (notifs && mounted) {
            setNotifications(notifs)
            setUnreadCount(notifs.filter(n => !n.is_read).length)
          }
        }
      } catch (err) {
        console.error("Error loading topbar data:", err)
      }
    }
    loadData()
    return () => { mounted = false; }
  }, [])

  const handleMarkAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      
    if (!error) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student'

  const isDashboardHome = pathname === '/dashboard'
  const isLessonPage = pathname.startsWith('/dashboard/lessons/')
  const isQuizPage = pathname.startsWith('/dashboard/quizzes/')

  return (
    <header className="flex h-16 md:h-20 items-center justify-between bg-white md:bg-transparent border-b md:border-b-0 px-4 md:px-8 shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-4 md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <div className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 md:hidden cursor-pointer text-gray-700">
              <Menu className="h-5 w-5" />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[240px]">
            <Sidebar className="w-full border-none h-full" />
          </SheetContent>
        </Sheet>
        <div className="md:hidden scale-75 origin-left">
          <Link to="/dashboard">
            <Logo variant="dark" />
          </Link>
        </div>
      </div>

      <div className="flex-1 hidden md:flex flex-col">
        {isDashboardHome && user ? (
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              Welcome back, {firstName}! <span className="text-lg">👋</span>
            </h1>
            <p className="text-gray-500 text-[11px] font-medium">You&apos;re on track. Keep learning and keep growing.</p>
          </div>
        ) : (isLessonPage || isQuizPage) ? (
          <Link to="/dashboard" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-primary transition-colors group w-fit">
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Dashboard
          </Link>
        ) : null}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full text-gray-500 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h4 className="font-semibold text-sm text-gray-900">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-primary/5' : ''}`}
                    onClick={() => {
                      if (!notif.is_read) handleMarkAsRead(notif.id)
                      if (notif.link) navigate(notif.link)
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {!notif.is_read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notif.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(notif.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
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
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
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
