import { Logo } from "@/components/Logo"
import { Outlet, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Luxury%20minimalist%20corporate%20lobby%20at%20night%2C%20deep%20navy%20and%20teal%20ambient%20lighting%2C%20cinematic%20composition%2C%20high-end%20aesthetic&image_size=landscape_16_9" 
          className="w-full h-full object-cover opacity-20"
          alt="Academy Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617] to-[#020617]" />
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 flex flex-col items-center"
        >
          <Logo />
          <p className="text-slate-400 mt-6 text-sm font-bold uppercase tracking-[0.3em]">
            The Elite Arsenal
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
          <Link to="/pricing" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-primary/50">
            <span>Start Your Own Academy</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Openlead Academy • All Rights Reserved
          </p>
        </motion.div>
      </div>
    </div>
  )
}
