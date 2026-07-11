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
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Complete Your Registration</DialogTitle>
          <DialogDescription>
            {company?.name || 'This academy'} requires a one-time signup fee to access the training platform.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div className="text-4xl font-bold text-gray-900">
            {getCurrencySymbol(feeCurrency)}{Number(feeAmount).toFixed(2)}
          </div>
          <p className="text-sm text-gray-500">One-time payment ({feeCurrency})</p>
        </div>

        <DialogFooter>
          <Button onClick={handlePayment} className="w-full bg-primary hover:bg-primary/90 text-white" disabled={loading}>
            {loading ? 'Processing...' : 'Pay with Stripe'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}