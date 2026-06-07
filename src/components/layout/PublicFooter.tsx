import { Link } from "react-router-dom"
import { Logo } from "@/components/Logo"

export function PublicFooter() {
  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-24 pb-12">
      <div className="container mx-auto px-6">
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
              <li><Link to="/login" className="hover:text-[#14B8A6] transition-colors">Member Portal</Link></li>
              <li><Link to="/about" className="hover:text-[#14B8A6] transition-colors">Our Philosophy</Link></li>
              <li><Link to="/vacancies" className="hover:text-[#14B8A6] transition-colors">Careers Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-widest mb-8">Foundation</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-[#14B8A6] transition-colors">Mission</Link></li>
              <li><Link to="/contact" className="hover:text-[#14B8A6] transition-colors">Contact Support</Link></li>
              <li><Link to="#" className="hover:text-[#14B8A6] transition-colors">Privacy & Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white text-xs uppercase tracking-widest mb-8">Network</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="#" className="hover:text-[#14B8A6] transition-colors">X / Twitter</Link></li>
              <li><Link to="#" className="hover:text-[#14B8A6] transition-colors">LinkedIn</Link></li>
              <li><Link to="#" className="hover:text-[#14B8A6] transition-colors">YouTube</Link></li>
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
