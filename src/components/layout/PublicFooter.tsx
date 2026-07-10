import { Link } from "react-router-dom"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Call to Action Banner */}
        <div className="mb-20 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl border border-white/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4">Want this platform for your team?</h3>
            <p className="text-slate-400 leading-relaxed">Launch your own fully branded academy. Train your team, onboard clients, or monetize your expertise using our enterprise infrastructure.</p>
          </div>
          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <Link to="/pricing">
              <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-black tracking-widest uppercase text-sm px-8 py-6 h-auto group">
                Start Your Academy
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <Logo />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Forging the world's most elite revenue leaders through rigorous training and exclusive community access.
            </p>
          </div>
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-widest mb-8">Academy</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/login" className="hover:text-primary transition-colors">Member Portal</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Our Philosophy</Link></li>
              <li><Link to="/vacancies" className="hover:text-primary transition-colors">Careers Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-widest mb-8">Foundation</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-primary transition-colors">Mission</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy & Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-widest mb-8">Network</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="#" className="hover:text-primary transition-colors">X / Twitter</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">LinkedIn</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">YouTube</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-slate-600 uppercase tracking-widest">
          <span>© {new Date().getFullYear()} Openlead Academy • All Rights Reserved</span>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-slate-400 transition-colors">Admissions</Link>
            <Link to="#" className="hover:text-slate-400 transition-colors">Security</Link>
            <Link to="#" className="hover:text-slate-400 transition-colors">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
