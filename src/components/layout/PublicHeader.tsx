import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { useEffect, useState } from "react"

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass-nav py-2" : "bg-transparent py-4"}`}>
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 bg-white/50 backdrop-blur-md px-6 py-2.5 rounded-full border border-slate-200/50 shadow-sm">
          <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Home</Link>
          <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">About Us</Link>
          <Link to="/vacancies" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Vacancies</Link>
          <Link to="/contact" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl">Student Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="rounded-xl text-white px-6 shadow-[0_8px_16px_rgba(20,184,166,0.25)] hover:shadow-[0_8px_20px_rgba(20,184,166,0.4)] transition-all bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:scale-[1.02] border border-transparent font-semibold">Apply Now</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
