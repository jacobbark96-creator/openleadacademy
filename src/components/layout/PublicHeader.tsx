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
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#020617]/80 backdrop-blur-xl py-2 border-b border-white/5" : "bg-transparent py-4"}`}>
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 bg-white/5 backdrop-blur-md px-8 py-3 rounded-full border border-white/10 shadow-2xl">
          <Link to="/" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Home</Link>
          <Link to="/about" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">About Us</Link>
          <Link to="/pricing" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors">Platform</Link>
          <Link to="/vacancies" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Vacancies</Link>
          <Link to="/contact" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-full px-6">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="rounded-full text-white px-8 shadow-[0_0_20px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all bg-primary hover:bg-primary/90 border-none font-black text-sm uppercase tracking-wider">Join Academy</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
