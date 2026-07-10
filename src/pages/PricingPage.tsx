import { PublicHeader } from "@/components/layout/PublicHeader"
import { PublicFooter } from "@/components/layout/PublicFooter"
import SEO from "@/components/SEO"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Check, Shield, Zap, Globe, Users, CreditCard } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#020617] selection:bg-primary/30">
      <SEO 
        title="Pricing & Plans" 
        description="Launch your own elite training academy with our enterprise infrastructure." 
      />
      <PublicHeader />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative px-6 py-12 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto max-w-3xl text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
              Enterprise <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#38BDF8]">Infrastructure</span>
            </h1>
            <p className="text-base text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
              Launch your own fully branded academy. Train your team, onboard clients, or monetize your expertise without writing a single line of code.
            </p>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Starter Tier */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden backdrop-blur-sm">
              <div className="mb-6">
                <h3 className="text-lg font-black text-white uppercase tracking-widest mb-1">Internal Team</h3>
                <p className="text-slate-400 text-xs">Perfect for companies training their own employees.</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">$99</span>
                  <span className="text-slate-500 font-bold text-sm">/mo</span>
                </div>
                <p className="text-primary text-xs font-bold mt-1">14-Day Free Trial</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "Up to 50 active users",
                  "Custom Subdomain (e.g., yourname.openleadacademy.com)",
                  "Custom Logo & Brand Colors",
                  "Unlimited Courses & Modules",
                  "Advanced Analytics & Progress Tracking",
                  "Community Access for your team"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register-academy?plan=starter">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black tracking-widest uppercase py-5 text-xs">
                  Start 14-Day Free Trial
                </Button>
              </Link>
            </div>

            {/* Professional Tier (Highlighted) */}
            <div className="bg-gradient-to-b from-slate-900 to-[#020617] border border-primary/30 rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden shadow-[0_0_40px_hsl(var(--primary)/0.1)]">
              <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black uppercase tracking-widest py-1 px-3 rounded-bl-lg">
                Most Popular
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-black text-primary uppercase tracking-widest mb-1">Commercial</h3>
                <p className="text-slate-400 text-xs">For creators & businesses selling courses to clients.</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">$299</span>
                  <span className="text-slate-500 font-bold text-sm">/mo</span>
                </div>
                <p className="text-primary text-xs font-bold mt-1">14-Day Free Trial</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "Everything in Internal Team, plus:",
                  "Unlimited active users",
                  "Custom Domain (e.g., training.yourcompany.com)",
                  "Stripe Connect Integration",
                  "Charge users directly for access",
                  "White-labeled email notifications",
                  "Priority 24/7 Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className={i === 0 ? "font-bold text-white" : ""}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register-academy?plan=commercial">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black tracking-widest uppercase py-5 text-xs shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all">
                  Start 14-Day Free Trial
                </Button>
              </Link>
            </div>

          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 mt-20 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Enterprise Features Included</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/5 p-6 rounded-xl">
              <Globe className="w-6 h-6 text-primary mb-4" />
              <h4 className="text-white text-sm font-bold mb-1">Custom Domains</h4>
              <p className="text-xs text-slate-400">Host your academy on your own URL. Your users will never see the Openlead Academy brand.</p>
            </div>
            <div className="bg-white/5 border border-white/5 p-6 rounded-xl">
              <CreditCard className="w-6 h-6 text-primary mb-4" />
              <h4 className="text-white text-sm font-bold mb-1">Monetization Ready</h4>
              <p className="text-xs text-slate-400">Connect your Stripe account in one click and start charging users for access to your content.</p>
            </div>
            <div className="bg-white/5 border border-white/5 p-6 rounded-xl">
              <Shield className="w-6 h-6 text-primary mb-4" />
              <h4 className="text-white text-sm font-bold mb-1">Data Isolation</h4>
              <p className="text-xs text-slate-400">Enterprise-grade security. Your users, content, and data are strictly isolated from other tenants.</p>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
