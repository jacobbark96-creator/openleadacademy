import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTenant } from '@/providers/TenantProvider'

interface PaymentModalProps {
  isOpen: boolean
  feeAmount: number
  feeCurrency?: string
  feeBreakdown?: { name: string; amount: number }[]
  legalDocuments?: { title: string; content: string }[]
  onPay: (acceptedDocs: string[]) => void
}

export function PaymentModal({ 
  isOpen, 
  feeAmount, 
  feeCurrency = 'GBP', 
  feeBreakdown = [], 
  legalDocuments = [],
  onPay 
}: PaymentModalProps) {
  const { company } = useTenant()
  const [loading, setLoading] = useState(false)
  const [acceptedDocs, setAcceptedDocs] = useState<string[]>([])

  const handlePayment = async () => {
    if (legalDocuments.length > 0 && acceptedDocs.length < legalDocuments.length) {
      return
    }
    setLoading(true)
    await onPay(acceptedDocs)
    setLoading(false)
  }

  const toggleDoc = (title: string) => {
    setAcceptedDocs(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title) 
        : [...prev, title]
    )
  }

  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode.toUpperCase()) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  }

  const isButtonDisabled = loading || (legalDocuments.length > 0 && acceptedDocs.length < legalDocuments.length)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing
    }}>
      <DialogContent 
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" 
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter">Complete Your Registration</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            {company?.name || 'This academy'} requires you to review our terms and complete a one-time signup fee.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-8">
          {/* Legal Documents Section */}
          {legalDocuments.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Legal Agreements</h4>
              <div className="space-y-3">
                {legalDocuments.map((doc, index) => (
                  <div key={index} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-3">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id={`doc-${index}`}
                        checked={acceptedDocs.includes(doc.title)}
                        onChange={() => toggleDoc(doc.title)}
                        className="mt-1 w-5 h-5 rounded-lg border-slate-200 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                      />
                      <label htmlFor={`doc-${index}`} className="flex-1 cursor-pointer">
                        <span className="text-sm font-bold text-slate-900 block">{doc.title}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">I have read and agree to the {doc.title}</span>
                      </label>
                    </div>
                    
                    <div className="max-h-[100px] overflow-y-auto p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 font-medium leading-relaxed">
                      {doc.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cost Breakdown Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Payment Summary</h4>
            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
              <div className="space-y-3">
                {feeBreakdown.length > 0 ? (
                  feeBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-slate-400 font-bold">{item.name}</span>
                      <span className="font-black">{getCurrencySymbol(feeCurrency)}{Number(item.amount).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold">Platform Access</span>
                    <span className="font-black">{getCurrencySymbol(feeCurrency)}{Number(feeAmount).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-black border-t border-slate-800 pt-4 mt-4">
                  <span className="text-white">Total Due</span>
                  <span className="text-primary">{getCurrencySymbol(feeCurrency)}{Number(feeAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handlePayment} 
            className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-2xl text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale" 
            disabled={isButtonDisabled}
          >
            {loading ? 'Redirecting to Stripe...' : 'Agree & Pay Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}