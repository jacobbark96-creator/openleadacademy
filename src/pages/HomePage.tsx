import { PublicHeader } from "@/components/layout/PublicHeader"
import { PublicFooter } from "@/components/layout/PublicFooter"
import SEO from "@/components/SEO"
import { Button } from "@/components/ui/button"
import { Link, Navigate } from "react-router-dom"
import { ArrowRight, TrendingUp, Users, Target } from "lucide-react"
import { motion } from "framer-motion"
import { useTenant } from "@/providers/TenantProvider"

export default function HomePage() {
  const { company } = useTenant()

  // If this is a tenant subdomain, redirect directly to login
  if (company && company.slug !== 'openlead') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      <SEO 
        title="The Elite Sales Academy | Admission by Application" 
        description="Openlead Academy is the world's most prestigious training ground for the next generation of revenue leaders. We select only the top 2% of applicants for our intensive sales mastery program."
      />
      <PublicHeader />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Ultra-modern%20elite%20corporate%20architecture%20at%20night%2C%20deep%20navy%20and%20teal%20lighting%2C%20highly%20detailed%2C%20minimalist%20luxury&image_size=landscape_16_9" 
              className="w-full h-full object-cover opacity-30"
              alt="Elite Academy Background"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617] to-[#020617]" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6">
                Admission by Application Only
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                THE ELITE ARSENAL <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white/60">
                  FOR TOP 2% SELLERS
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                The most rigorous sales training program in the world. 
                Built for those who refuse to be average.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="h-14 px-10 text-base font-black bg-primary hover:bg-primary/90 text-white rounded-full shadow-[0_0_30px_hsl(var(--primary)/0.3)] border-0">
                    APPLY FOR ADMISSION
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-base font-bold text-white border-white/10 hover:bg-white/5 rounded-full">
                    VIEW THE CURRICULUM
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Global Impact Bar */}
        <section className="py-12 border-y border-white/5 bg-[#020617]/50 backdrop-blur-sm relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-6">Graduates Placed At Global Leaders</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                {['Salesforce', 'HubSpot', 'Oracle', 'Gartner', 'McKinsey'].map((brand) => (
                  <span key={brand} className="text-xl md:text-2xl font-black text-white tracking-tighter italic">{brand}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Exclusive Preview */}
        <section className="py-20 px-4 relative z-10 bg-[#020617]">
          <div className="container mx-auto max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="rounded-[40px] p-1 bg-gradient-to-br from-primary/30 via-white/5 to-transparent shadow-[0_0_100px_hsl(var(--primary)/0.1)]"
            >
              <div className="rounded-[39px] bg-[#020617] overflow-hidden border border-white/10">
                <div className="aspect-[16/10] md:aspect-[16/9] relative group">
                  {/* High-end Dashboard Preview */}
                  <div className="absolute inset-0 flex bg-[#030712]">
                    <div className="w-[240px] border-r border-white/5 bg-[#030712] p-6 hidden lg:block">
                      <div className="h-8 w-32 bg-white/10 rounded-xl mb-10" />
                      <div className="space-y-5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="h-5 w-5 bg-white/5 rounded-lg" />
                            <div className="h-3 bg-white/5 rounded-lg w-24" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 p-8 md:p-12 flex flex-col">
                      <div className="h-10 w-64 bg-white/10 rounded-2xl mb-10" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="md:col-span-2 h-48 md:h-64 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-6 md:p-8">
                             <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-[10px] md:border-[12px] border-primary/20 border-t-primary" />
                          </div>
                          <div className="space-y-3">
                            <div className="h-6 w-48 md:w-64 bg-white/10 rounded-xl" />
                            <div className="h-3 w-32 md:w-48 bg-white/5 rounded-lg" />
                            <div className="pt-8 md:pt-12">
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-primary" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="h-48 md:h-64 bg-primary/10 rounded-3xl p-6 md:p-8 flex flex-col justify-end">
                           <div className="text-3xl md:text-4xl font-black text-white mb-1">85%</div>
                           <div className="text-xs font-bold text-primary uppercase tracking-widest">Mastery Level</div>
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
                  className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6"
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
                      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary font-black">
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
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full" />
                 <div className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl z-10 aspect-square md:aspect-auto">
                   <img 
                      src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern+luxury+boardroom+meeting+selective+focus+high+end+business+environment+teal+accents&image_size=square_hd" 
                      alt="Prestigious Academy" 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                   />
                 </div>
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
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/20 transition-all" />
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-primary/20">
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
