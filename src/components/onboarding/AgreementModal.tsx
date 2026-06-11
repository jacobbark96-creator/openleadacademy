import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, ShieldCheck, ScrollText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AgreementModalProps {
  isOpen: boolean
  title: string
  content: string
  onSign: (signatureName: string) => void
  step: number
  totalSteps: number
}

export function AgreementModal({
  isOpen,
  title,
  content,
  onSign,
  step,
  totalSteps
}: AgreementModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [hasAgreed, setHasAgreed] = useState(false)
  const [signatureName, setSignatureName] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      // If we're within 30px of the bottom, consider it scrolled
      if (scrollTop + clientHeight >= scrollHeight - 30) {
        setHasScrolledToBottom(true)
      }
    }
  }

  // Reset states when title changes (new step)
  useEffect(() => {
    setHasScrolledToBottom(false)
    setHasAgreed(false)
    setSignatureName('')
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [title])

  const canSign = hasScrolledToBottom && hasAgreed && signatureName.trim().length > 2

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-2xl"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#14B8A6]/10 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-[#14B8A6]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{title}</h2>
                  <p className="text-xs font-semibold text-[#14B8A6] uppercase tracking-widest">Mandatory Onboarding • Step {step} of {totalSteps}</p>
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden mt-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                className="h-full bg-[#14B8A6]"
              />
            </div>
          </div>

          {/* Content Area */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="p-8 max-h-[45vh] overflow-y-auto bg-slate-50/30 dark:bg-black/20"
          >
            <div className="whitespace-pre-wrap text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium font-sans">
              {content}
            </div>
          </div>

          {/* Footer / Controls */}
          <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-slate-900 space-y-6">
            {!hasScrolledToBottom && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 text-xs font-bold text-[#14B8A6] uppercase tracking-widest bg-[#14B8A6]/5 py-2 rounded-lg border border-[#14B8A6]/20"
              >
                <ScrollText className="w-4 h-4" />
                Please scroll to the bottom to verify review
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 transition-all">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={hasAgreed}
                    onChange={(e) => setHasAgreed(e.target.checked)}
                    disabled={!hasScrolledToBottom}
                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-gray-300 dark:border-white/20 transition-all checked:bg-[#14B8A6] checked:border-[#14B8A6] disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Check className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={3} />
                </div>
                <label 
                  htmlFor="agree" 
                  className={cn(
                    "text-[13px] font-semibold leading-snug transition-opacity",
                    !hasScrolledToBottom ? "text-slate-400" : "text-slate-700 dark:text-slate-200 cursor-pointer"
                  )}
                >
                  I acknowledge that I have read, understood, and voluntarily agree to the terms and conditions outlined in this {title.toLowerCase()}.
                </label>
              </div>

              <div className="space-y-2.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Digital Signature (Type Full Legal Name)</label>
                <Input
                  placeholder="Enter your name to sign electronically"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  disabled={!hasAgreed}
                  className="bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 h-12 text-base px-4 font-semibold focus:ring-4 focus:ring-[#14B8A6]/10"
                />
              </div>
            </div>

            <Button
              onClick={() => onSign(signatureName)}
              disabled={!canSign}
              className="w-full h-14 text-base font-black uppercase tracking-[0.15em] shadow-[0_10px_30px_rgba(20,184,166,0.3)] hover:shadow-[0_15px_40px_rgba(20,184,166,0.5)] transition-all active:scale-[0.98] disabled:shadow-none"
            >
              Sign & {step === totalSteps ? 'Finalize Access' : 'Proceed to Next Step'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
