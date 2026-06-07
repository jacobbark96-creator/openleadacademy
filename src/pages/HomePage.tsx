import { PublicHeader } from "@/components/layout/PublicHeader"
import { PublicFooter } from "@/components/layout/PublicFooter"
import SEO from "@/components/SEO"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight, TrendingUp, Users, Target } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      <SEO 
        title="The Elite Sales Academy | Admission by Application" 
        description="Openlead Academy is the world's most prestigious training ground for the next generation of revenue leaders. We select only the top 2% of applicants for our intensive sales mastery program."
      />
      <PublicHeader />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-48 pb-32 px-4">
          <div className="absolute inset-0 bg-[url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=abstract+luxury+dark+geometric+background+with+subtle+teal+glow+lines+high+resolution+minimalist&image_size=landscape_16_9')] bg-cover bg-center opacity-20 z-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] z-0" />
          
          {/* Selective Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#14B8A6]/10 blur-[160px] rounded-full z-0 pointer-events-none" />

          <div className="container mx-auto text-center max-w-5xl relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#14B8A6] font-bold text-xs uppercase tracking-[0.2em] mb-12 hover:bg-white/10 transition-all cursor-default shadow-[0_0_20px_rgba(20,184,166,0.1)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]"></span>
              </span>
              Admission by Application Only • 2026 Cohort
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.95]"
            >
              Forging The Next <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] via-[#2DD4BF] to-[#0D9488] relative">
                Revenue Elite
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              The world's most rigorous training academy for high-stakes sales. We don't just teach—we transform the top 2% of applicants into dominant revenue leaders.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link to="/signup">
                <Button className="rounded-full h-16 px-12 text-xl text-white shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.5)] transition-all w-full sm:w-auto bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:scale-[1.05] border-none font-black group">
                  Request Admission <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="rounded-full h-16 px-12 text-xl bg-white/5 backdrop-blur-md border-white/10 text-white w-full sm:w-auto hover:bg-white/10 hover:border-white/20 font-bold transition-all hover:scale-[1.05]">
                  Member Portal
                </Button>
              </Link>
            </motion.div>

            {/* Trust Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-24 pt-12 border-t border-white/5"
            >
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500 mb-8">Graduates Placed At Global Leaders</p>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                {['Salesforce', 'HubSpot', 'Oracle', 'Gartner', 'McKinsey'].map((brand) => (
                  <span key={brand} className="text-2xl font-black text-white tracking-tighter italic">{brand}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Exclusive Preview */}
        <section className="py-24 px-4 relative z-10 bg-[#020617]">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="rounded-[40px] p-1 bg-gradient-to-br from-[#14B8A6]/30 via-white/5 to-transparent shadow-[0_0_100px_rgba(20,184,166,0.1)]"
            >
              <div className="rounded-[39px] bg-[#020617] overflow-hidden border border-white/10">
                <div className="aspect-[16/9] relative group">
                  {/* High-end Dashboard Preview */}
                  <div className="absolute inset-0 flex bg-[#030712]">
                    <div className="w-[280px] border-r border-white/5 bg-[#030712] p-8 hidden md:block">
                      <div className="h-10 w-40 bg-white/10 rounded-xl mb-12" />
                      <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="h-6 w-6 bg-white/5 rounded-lg" />
                            <div className="h-4 bg-white/5 rounded-lg w-32" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 p-12 flex flex-col">
                      <div className="h-12 w-80 bg-white/10 rounded-2xl mb-12" />
                      <div className="grid grid-cols-3 gap-8 mb-12">
                        <div className="col-span-2 h-64 bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8">
                             <div className="h-32 w-32 rounded-full border-[12px] border-[#14B8A6]/20 border-t-[#14B8A6]" />
                          </div>
                          <div className="space-y-4">
                            <div className="h-8 w-64 bg-white/10 rounded-xl" />
                            <div className="h-4 w-48 bg-white/5 rounded-lg" />
                            <div className="pt-12">
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-[#14B8A6]" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="h-64 bg-[#14B8A6]/10 rounded-3xl p-8 flex flex-col justify-end">
                           <div className="text-4xl font-black text-white mb-2">85%</div>
                           <div className="text-sm font-bold text-[#14B8A6] uppercase tracking-widest">Mastery Level</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent flex items-end justify-center pb-16">
                    <div className="px-10 py-5 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
                      <span className="text-white font-black tracking-widest uppercase text-sm">Exclusive Member Interface</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Selective Process Section */}
        <section className="py-24 bg-[#020617] relative border-y border-white/5">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-block px-4 py-1 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] text-xs font-black uppercase tracking-widest mb-6"
                >
                  The Selection Process
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                  We don't take <br/> everyone. <br/>
                  <span className="text-slate-500">Only the driven.</span>
                </h2>
                <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                  Our curriculum is designed for high-performance. We maintain a strict selection process to ensure every member of the cohort is capable of reaching the elite levels we demand.
                </p>
                <div className="space-y-6">
                  {[
                    { title: "Phase 1: Application", desc: "Detailed review of your background and career goals." },
                    { title: "Phase 2: Strategy Interview", desc: "A 1-on-1 deep dive into your drive and aptitude." },
                    { title: "Phase 3: Acceptance", desc: "Invitation to join the world's most elite sales network." }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#14B8A6] font-black">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                        <p className="text-slate-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#14B8A6]/20 to-transparent blur-3xl rounded-full" />
                 <img 
                    src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury+office+interior+modern+minimalist+dark+tones+with+teal+accents+high+end+academy+vibe&image_size=square_hd" 
                    alt="Prestigious Academy" 
                    className="relative rounded-[40px] border border-white/10 shadow-2xl z-10"
                 />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-[#020617] relative z-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Elite Arsenal</h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium">We provide the tools. You provide the drive. Together, we dominate.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: TrendingUp,
                  title: "Elite Curriculum",
                  desc: "Master-level modules covering high-ticket closing, psychological warfare, and strategic negotiation."
                },
                {
                  icon: Target,
                  title: "Real-World Combat",
                  desc: "Intensive live roleplays and pressure-testing to ensure you perform when the stakes are highest."
                },
                {
                  icon: Users,
                  title: "The Inner Circle",
                  desc: "Lifetime access to a network of top 1% earners and exclusive career opportunities."
                }
              ].map((feature, i) => (
                <div key={i} className="p-10 rounded-[40px] bg-white/5 hover:bg-white/10 transition-all duration-500 border border-white/5 hover:border-white/20 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#14B8A6]/5 blur-3xl group-hover:bg-[#14B8A6]/20 transition-all" />
                  <div className="w-16 h-16 bg-[#14B8A6]/10 rounded-2xl flex items-center justify-center mb-10 text-[#14B8A6] group-hover:scale-110 group-hover:bg-[#14B8A6] group-hover:text-white transition-all duration-500 border border-[#14B8A6]/20">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-lg group-hover:text-slate-300 transition-colors">{feature.desc}</p>
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
