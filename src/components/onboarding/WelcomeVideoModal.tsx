import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Video } from "lucide-react"
import ReactPlayer from 'react-player'

interface WelcomeVideoModalProps {
  isOpen: boolean;
  videoUrl: string | null;
  companyName: string;
  onContinue: () => void;
}

export function WelcomeVideoModal({ isOpen, videoUrl, companyName, onContinue }: WelcomeVideoModalProps) {
  const [hasWatched, setHasWatched] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasWatched(false)
    }
  }, [isOpen])

  const canContinue = !videoUrl || hasWatched

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-slate-200">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-black text-center text-slate-900 uppercase tracking-wider flex items-center justify-center gap-3">
            <Video className="w-6 h-6 text-primary" />
            Welcome to {companyName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          {videoUrl ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner border border-slate-200">
              <ReactPlayer
                src={videoUrl}
                width="100%"
                height="100%"
                controls={true}
                onEnded={() => setHasWatched(true)}
              />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
              <p className="text-slate-500 font-medium">Welcome video coming soon.</p>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-0 sm:justify-center flex-col items-center gap-2">
          <Button 
            onClick={onContinue} 
            disabled={!canContinue}
            className={`w-full sm:w-auto rounded-2xl h-12 px-8 font-black uppercase tracking-wider transition-all ${
              canContinue 
                ? 'bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_hsl(var(--primary)/0.2)]' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Continue to Academy
          </Button>
          {!canContinue && (
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
              Please watch the video to continue
            </p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}