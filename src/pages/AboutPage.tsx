import { PublicHeader } from "@/components/layout/PublicHeader"
import { PublicFooter } from "@/components/layout/PublicFooter"
import SEO from "@/components/SEO"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TeamMember {
  id?: string;
  name: string;
  role_title: string;
  initials?: string;
  image_url?: string;
  order_index?: number;
}

export default function AboutPage() {
  const [members, setMembers] = useState<TeamMember[]>([
    { name: "Sarah Jenkins", role_title: "Head of Academy", initials: "SJ" },
    { name: "Marcus Thorne", role_title: "Lead Sales Trainer", initials: "MT" },
    { name: "Elena Rostova", role_title: "Careers Director", initials: "ER" }
  ]);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const { data: teamMembers } = await supabase
          .from('team_members')
          .select('*')
          .order('order_index', { ascending: true })
        
        if (teamMembers && teamMembers.length > 0) {
          setMembers(teamMembers)
        }
      } catch (err) {
        console.error("Error fetching team:", err)
      }
    }
    fetchTeam()
  }, [])

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <SEO 
        title="Our Philosophy" 
        description="Learn more about Openlead Academy's mission to forge the next generation of elite revenue leaders."
      />
      <PublicHeader />
      
      <main className="pt-48 pb-20">
        <div className="container mx-auto px-4 max-w-4xl text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8"
          >
            Our Philosophy
          </motion.h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            We exist to bridge the gap between ambition and high-performance revenue execution. Our mission is to forge the next generation of elite sales leaders.
          </p>
        </div>

        <div className="container mx-auto px-4 max-w-5xl space-y-32">
          <section className="bg-white/5 rounded-[40px] p-12 md:p-20 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#14B8A6]/5 blur-3xl" />
            <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-widest">Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-black text-[#14B8A6] mb-4 uppercase tracking-wider">Relentless Execution</h3>
                <p className="text-slate-400 leading-relaxed">Theory is nothing without action. We prioritize reps, roleplays, and real-world application over abstract concepts.</p>
              </div>
              <div>
                <h3 className="text-xl font-black text-[#14B8A6] mb-4 uppercase tracking-wider">Continuous Evolution</h3>
                <p className="text-slate-400 leading-relaxed">The market changes, and so do we. Our curriculum is constantly updated with the latest tactics working today.</p>
              </div>
              <div>
                <h3 className="text-xl font-black text-[#14B8A6] mb-4 uppercase tracking-wider">Integrity First</h3>
                <p className="text-slate-400 leading-relaxed">We teach sales as a service. We close deals by genuinely solving problems, not through manipulation.</p>
              </div>
              <div>
                <h3 className="text-xl font-black text-[#14B8A6] mb-4 uppercase tracking-wider">Elite Community</h3>
                <p className="text-slate-400 leading-relaxed">You are the average of the people you surround yourself with. We cultivate a network of winners.</p>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-black text-white mb-16 uppercase tracking-widest">Academy Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {members.map((leader: TeamMember, i: number) => {
                const initials = leader.initials || leader.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                return (
                  <div key={i} className="bg-white/5 rounded-[32px] p-10 border border-white/5 hover:border-white/20 transition-all flex flex-col items-center group">
                    {leader.image_url ? (
                      <div className="w-28 h-28 mb-6 rounded-full overflow-hidden border-2 border-[#14B8A6]/20 group-hover:border-[#14B8A6] transition-colors">
                        <img src={leader.image_url} alt={leader.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-28 h-28 bg-white/5 rounded-full mb-6 flex items-center justify-center text-3xl font-black text-slate-700 border-2 border-white/10 group-hover:border-[#14B8A6]/50 transition-colors">
                        {initials}
                      </div>
                    )}
                    <h3 className="text-xl font-black text-white mb-1 tracking-tight">{leader.name}</h3>
                    <p className="text-[#14B8A6] font-bold text-xs uppercase tracking-[0.2em]">{leader.role_title}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="bg-gradient-to-br from-[#14B8A6]/20 to-transparent rounded-[40px] p-16 text-center border border-[#14B8A6]/20">
            <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Ready for the challenge?</h2>
            <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg">Join the ranks of the world's most elite revenue generators.</p>
            <Link to="/signup">
              <Button className="rounded-full h-16 px-12 text-xl text-white shadow-[0_0_30px_rgba(20,184,166,0.2)] hover:shadow-[0_0_50px_rgba(20,184,166,0.4)] transition-all bg-[#14B8A6] hover:bg-[#0D9488] border-none font-black uppercase tracking-widest">
                Request Admission
              </Button>
            </Link>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
