import { PublicHeader } from "@/components/layout/PublicHeader"
import { PublicFooter } from "@/components/layout/PublicFooter"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

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
    <div className="min-h-screen bg-[#F8FAFC]">
      <PublicHeader />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-900 mb-6">
            About Openlead Academy
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            We exist to bridge the gap between ambition and high-performance sales execution. Our mission is to forge the next generation of elite revenue generators.
          </p>
        </div>

        <div className="container mx-auto px-4 max-w-5xl space-y-20">
          <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Relentless Execution</h3>
                <p className="text-gray-600">Theory is nothing without action. We prioritize reps, roleplays, and real-world application over abstract concepts.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Continuous Evolution</h3>
                <p className="text-gray-600">The market changes, and so do we. Our curriculum is constantly updated with the latest tactics working today.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity First</h3>
                <p className="text-gray-600">We teach sales as a service. We close deals by genuinely solving problems, not through manipulation.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Elite Community</h3>
                <p className="text-gray-600">You are the average of the five people you surround yourself with. We cultivate a network of winners.</p>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet the Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {members.map((leader: TeamMember, i: number) => {
                const initials = leader.initials || leader.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                return (
                  <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
                    {leader.image_url ? (
                      <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img src={leader.image_url} alt={leader.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-gray-400">
                        {initials}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900">{leader.name}</h3>
                    <p className="text-primary font-medium">{leader.role_title}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="bg-primary/5 rounded-3xl p-12 text-center border border-primary/10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to start your journey?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Join hundreds of successful graduates who have transformed their careers through our rigorous training program.</p>
            <Link to="/signup">
              <Button className="rounded-xl h-14 px-12 text-lg text-white shadow-[0_8px_20px_rgba(20,184,166,0.3)] hover:shadow-[0_12px_28px_rgba(20,184,166,0.4)] transition-all bg-gradient-to-r from-[#14B8A6] to-[#0D9488] hover:scale-[1.02] border border-transparent font-bold">
                Apply to the Academy
              </Button>
            </Link>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
