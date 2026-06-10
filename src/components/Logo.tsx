export function Logo({ className = "", variant = "light" }: { className?: string; variant?: "light" | "dark" }) {
  const textColor = variant === "light" ? "text-white" : "text-slate-900"

  return (
    <div className={`group flex flex-col items-start leading-none select-none transition-all duration-300 hover:scale-[1.02] hover:opacity-90 ${className}`}>
      <div className={`text-[32px] md:text-[36px] font-extrabold tracking-tighter ${textColor} flex items-baseline font-display`}>
        Openlead<span className="text-[#14B8A6] text-[40px] leading-[0.5] font-black drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]">.</span>
      </div>
      <div className="text-[11px] font-bold tracking-[0.35em] text-[#14B8A6] mt-1.5 ml-0.5 uppercase">
        Academy
      </div>
    </div>
  )
}
