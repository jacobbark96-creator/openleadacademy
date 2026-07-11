import { Logo } from "@/components/Logo"
import { Outlet, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useTenant } from "@/providers/TenantProvider"

export default function AuthLayout() {
  const { company } = useTenant()
  const isTenant = company && company.slug !== 'openlead'

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${isTenant ? 'bg-slate-50' : 'bg-[#020617]'}`}>
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={isTenant 
            ? "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Ultra-modern%20minimalist%20bright%20architectural%20space%2C%20clean%20lines%2C%20soft%20natural%20light%2C%20high-end%20aesthetic&image_size=landscape_16_9"
            : "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Luxury%20minimalist%20corporate%20lobby%20at%20night%2C%20deep%20navy%20and%20teal%20ambient%20lighting%2C%20cinematic%20composition%2C%20high-end%20aesthetic&image_size=landscape_16_9"
          }
          className={`w-full h-full object-cover transition-opacity duration-1000 ${isTenant ? 'opacity-10' : 'opacity-20'}`}
          alt="Academy Background"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${isTenant ? 'from-white/50 via-white to-white' : 'from-[#020617]/80 via-[#020617] to-[#020617]'}`} />
      </div>

      {/* Decorative Glows */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] blur-[120px] rounded-full z-0 pointer-events-none transition-all duration-500 ${isTenant ? 'bg-primary/10' : 'bg-primary/5'}`} />

      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 flex flex-col items-center"
        >
          <Logo />
          <p className={`mt-6 text-sm font-bold uppercase tracking-[0.3em] transition-colors ${isTenant ? 'text-slate-500' : 'text-slate-400'}`}>
            {isTenant ? company.name : 'The Elite Arsenal'}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Outlet />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 flex flex-col items-center gap-6"
        >
          <Link to="/pricing" className={`group flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${isTenant ? 'text-slate-500 hover:text-primary bg-slate-200/50 px-4 py-2 rounded-full border border-slate-300/50 hover:border-primary/50' : 'text-slate-400 hover:text-primary bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-primary/50'}`}>
            <span>Start Your Own Academy</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className={`text-center text-[10px] font-bold uppercase tracking-widest transition-colors ${isTenant ? 'text-slate-400' : 'text-slate-600'}`}>
            © {new Date().getFullYear()} Openlead Academy • All Rights Reserved
          </p>
        </motion.div>
      </div>
    </div>
  )
}
