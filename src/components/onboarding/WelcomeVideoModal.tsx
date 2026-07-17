import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Video } from "lucide-react"

interface WelcomeVideoModalProps {
  isOpen: boolean;
  videoUrl: string | null;
  companyName: string;
  onContinue: () => void;
}

export function WelcomeVideoModal({ isOpen, videoUrl, companyName, onContinue }: WelcomeVideoModalProps) {
  
  // Extract YouTube/Vimeo IDs if possible, else just use the URL
  const getEmbedUrl = (url: string) => {
    if (!url) return ''
    if (url.includes('youtube.com/watch?v=')) {
      // Handle URLs like https://www.youtube.com/watch?v=VIDEO_ID&t=10s
      const videoId = new URL(url).searchParams.get('v')
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'www.youtube.com/embed/')
    }
    if (url.includes('vimeo.com/')) {
      const vimeoId = url.split('vimeo.com/')[1].split(/[?#]/)[0]
      return `https://player.vimeo.com/video/${vimeoId}`
    }
    return url
  }

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
              <iframe
                src={getEmbedUrl(videoUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
              <p className="text-slate-500 font-medium">Welcome video coming soon.</p>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-0 sm:justify-center">
          <Button 
            onClick={onContinue} 
            className="w-full sm:w-auto rounded-2xl h-12 px-8 font-black uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
          >
            Continue to Academy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}