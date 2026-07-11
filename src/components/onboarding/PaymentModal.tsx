import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTenant } from '@/providers/TenantProvider'

interface PaymentModalProps {
  isOpen: boolean
  feeAmount: number
  feeCurrency?: string
  onPay: () => void
}

export function PaymentModal({ isOpen, feeAmount, feeCurrency = 'GBP', onPay }: PaymentModalProps) {
  const { company } = useTenant()
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    await onPay()
    setLoading(false)
  }

  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode.toUpperCase()) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing
    }}>
      <DialogContent 
        className="sm:max-w-[425px]" 
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Complete Your Registration</DialogTitle>
          <DialogDescription>
            {company?.name || 'This academy'} requires a one-time signup fee to access the training platform.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-2">Cost Breakdown</h4>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Platform Access</span>
              <span>{getCurrencySymbol(feeCurrency)}{Number(feeAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
              <span>Total Due</span>
              <span>{getCurrencySymbol(feeCurrency)}{Number(feeAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handlePayment} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-11" disabled={loading}>
            {loading ? 'Processing...' : 'Pay with Stripe'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}