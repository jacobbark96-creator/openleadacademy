"use client"

import { PublicHeader } from "@/components/layout/PublicHeader"
import { PublicFooter } from "@/components/layout/PublicFooter"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, TrendingUp, Users, Target } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      <PublicHeader />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 px-4">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] z-0" />
          {/* Subtle Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#14B8A6]/20 blur-[120px] rounded-full z-0 pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-[#3B82F6]/15 blur-[100px] rounded-full z-0 pointer-events-none" />

          <div className="container mx-auto text-center max-w-5xl relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 font-semibold text-sm mb-10 hover:shadow-md transition-shadow cursor-default"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#14B8A6]"></span>
              </span>
              Now accepting applications for the 2026 cohort
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 mb-8 leading-[1.1]"
            >
              Build Elite Sales Skills With <br className="hidden md:block" />
              <span className="text-gradient-primary relative inline-block">
                Openlead Academy
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#14B8A6]/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              The premium learning management system designed to transform beginners into top-performing sales professionals. Join our elite network today.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/signup">
                <Button className="rounded-xl h-14 px-8 text-lg text-white shadow-[0_8px_20px_rgba(20,184,166,0.3)] hover:shadow-[0_12px_28px_rgba(20,184,166,0.4)] transition-all w-full sm:w-auto bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:scale-[1.02] border border-transparent font-bold group">
                  Apply Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="rounded-xl h-14 px-8 text-lg bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 w-full sm:w-auto hover:bg-white hover:text-slate-900 font-semibold shadow-sm hover:shadow transition-all hover:scale-[1.02]">
                  Student Login
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Dashboard Preview Mockup */}
        <section className="py-12 px-4 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl p-3 md:p-6 bg-white/30 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 group"
            >
              <div className="aspect-[16/9] rounded-2xl bg-white overflow-hidden relative shadow-inner border border-slate-100 transition-transform duration-700 group-hover:scale-[1.01]">
                {/* Simulated Dashboard UI */}
                <div className="absolute inset-0 flex bg-slate-50/50">
                  <div className="w-[240px] border-r border-slate-100 bg-white p-6 hidden md:block">
                    <div className="h-8 w-32 bg-slate-100 rounded-lg mb-10" />
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-5 w-5 bg-slate-100 rounded-md" />
                          <div className="h-4 bg-slate-100 rounded-md w-24" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 p-8 flex flex-col">
                    <div className="h-10 w-64 bg-slate-200/50 rounded-xl mb-8" />
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="col-span-2 h-48 bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
                        <div className="flex gap-6">
                          <div className="w-24 h-24 rounded-full border-4 border-slate-50" />
                          <div className="flex-1 space-y-3 pt-2">
                            <div className="h-5 w-48 bg-slate-100 rounded-md" />
                            <div className="h-3 w-32 bg-slate-50 rounded-md" />
                            <div className="h-2 w-full bg-slate-50 rounded-full mt-4" />
                          </div>
                        </div>
                      </div>
                      <div className="h-48 bg-[#EBF5F5] rounded-2xl p-6 flex flex-col justify-center">
                         <div className="w-12 h-12 rounded-full bg-white mb-4" />
                         <div className="h-5 w-32 bg-white/60 rounded-md mb-2" />
                         <div className="h-4 w-40 bg-white/40 rounded-md" />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-4">
                       <div className="h-6 w-48 bg-slate-100 rounded-md mb-6" />
                       {[1,2].map(i => (
                         <div key={i} className="h-20 bg-slate-50 rounded-xl flex items-center p-4 gap-4">
                           <div className="w-24 h-12 bg-slate-200 rounded-lg" />
                           <div className="flex-1 space-y-2">
                             <div className="h-4 w-40 bg-slate-200 rounded-md" />
                             <div className="h-3 w-64 bg-slate-100 rounded-md" />
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
                {/* Overlay Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent flex items-end justify-center pb-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-slate-900 font-bold px-8 py-4 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    Premium SaaS Learning Experience
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white relative z-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Everything you need to succeed</h2>
              <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-medium">A comprehensive toolkit designed for the modern sales professional.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: "Structured Curriculum",
                  desc: "Weekly unlocked modules that guide you from basics to advanced closing techniques."
                },
                {
                  icon: Target,
                  title: "Interactive Quizzes",
                  desc: "Test your knowledge instantly with our built-in assessment engine."
                },
                {
                  icon: Users,
                  title: "Careers Portal",
                  desc: "Direct access to top companies hiring for SDRs and closers."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 md:p-10 rounded-[32px] bg-slate-50/80 hover:bg-white transition-all duration-300 border border-slate-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 text-[#14B8A6] group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
