import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { AgreementModal } from '@/components/onboarding/AgreementModal'
import { PaymentModal } from '@/components/onboarding/PaymentModal'
import { NDA_CONTENT, SUBCONTRACTOR_CONTENT } from '@/constants/agreements'
import { toast } from 'sonner'
import { useTenant } from '@/providers/TenantProvider'

interface OnboardingContextType {
  isComplete: boolean
  isLoading: boolean
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: NDA, 2: Subcontractor
  const { company: tenant } = useTenant()

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, companies:company_id(*)')
        .eq('id', session.user.id)
        .single()
      
      if (data) {
        console.log("ONBOARDING: Profile Loaded:", {
          id: data.id,
          email: data.email,
          signup_fee: data.signup_fee,
          has_paid: data.has_paid_signup_fee,
          company_slug: data.companies?.slug
        })
        setProfile(data)
        
        // 1. Check for unpaid signup fee first (applies to tenants)
        if (data.signup_fee > 0 && !data.has_paid_signup_fee) {
          setShowPaymentModal(true)
          setIsLoading(false)
          return
        } else {
          setShowPaymentModal(false)
        }

        // 2. Skip legal onboarding if not the default tenant
        if (data.companies?.slug !== 'openlead') {
          setShowModal(false)
          setIsLoading(false)
          return
        }

        // 3. Determine initial step for Openlead users
        if (!data.nda_signed) {
          setCurrentStep(1)
          setShowModal(true)
        } else if (!data.subcontractor_signed) {
          setCurrentStep(2)
          setShowModal(true)
        } else {
          setShowModal(false)
        }
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [tenant])

  const handleSign = async (signatureName: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      if (currentStep === 1) {
        // Sign NDA
        const { error } = await supabase
          .from('profiles')
          .update({
            nda_signed: true,
            nda_signed_at: new Date().toISOString(),
            agreement_signature_name: signatureName
          })
          .eq('id', session.user.id)

        if (error) throw error
        
        toast.success('NDA Signed successfully')
        
        // Move to next step or finish
        if (!profile.subcontractor_signed) {
          setCurrentStep(2)
        } else {
          setShowModal(false)
        }
      } else if (currentStep === 2) {
        // Sign Subcontractor Agreement
        const { error } = await supabase
          .from('profiles')
          .update({
            subcontractor_signed: true,
            subcontractor_signed_at: new Date().toISOString(),
            agreement_signature_name: signatureName // Ensure name is kept/updated
          })
          .eq('id', session.user.id)

        if (error) throw error

        toast.success('Subcontractor Agreement Signed successfully')
        setShowModal(false)
      }
      
      // Refresh profile data
      await fetchProfile()
    } catch (error: any) {
      console.error('Error signing agreement:', error)
      toast.error(error.message || 'Failed to sign agreement')
    }
  }

  const handlePaySignupFee = async (acceptedDocs: string[]) => {
    try {
      // 1. Update accepted legal documents first
      if (acceptedDocs.length > 0) {
        await supabase
          .from('profiles')
          .update({ accepted_legal_documents: acceptedDocs })
          .eq('id', profile.id)
      }

      const { data: { session } } = await supabase.auth.getSession()
      console.log('Payment session check:', { 
        hasSession: !!session,
        userId: session?.user?.id,
        profileId: profile.id
      })

      const { data, error } = await supabase.functions.invoke('stripe', {
        body: { 
          action: 'checkout-signup-fee',
          feeAmount: profile.signup_fee,
          feeCurrency: profile.signup_fee_currency || 'GBP',
          companyId: profile.company_id
        }
      })
      
      if (error) {
        console.error('Supabase Function Error:', error)
        // Try to parse the error body if it's a response object
        let errorMessage = error.message
        if (error.context && typeof error.context.json === 'function') {
          try {
            const errorBody = await error.context.json()
            errorMessage = errorBody.error || errorMessage
          } catch (e) {
            console.error('Failed to parse error body:', e)
          }
        }
        throw new Error(errorMessage)
      }

      if (data?.url) {
        window.location.href = data.url
      } else {
        // Fallback for when stripe isn't fully integrated yet
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ has_paid_signup_fee: true })
          .eq('id', profile.id)
        if (updateError) throw updateError
        
        toast.success('Payment simulated successfully! (Stripe in test mode)')
        setShowPaymentModal(false)
        await fetchProfile()
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Failed to initiate payment')
    }
  }

  // A user's onboarding is complete if:
  // 1. They are NOT loading AND
  // 2. They don't have an unpaid signup fee AND
  // 3. They have accepted all tenant legal documents AND
  // 4. They are either a tenant user OR they've signed both NDAs
  const hasUnpaidFee = profile?.signup_fee > 0 && !profile?.has_paid_signup_fee
  
  const tenantDocs = profile?.companies?.legal_documents || []
  const acceptedTenantDocs = profile?.accepted_legal_documents || []
  const hasAcceptedAllTenantDocs = tenantDocs.length === 0 || tenantDocs.every((doc: any) => acceptedTenantDocs.includes(doc.title))

  const isComplete = !isLoading && !!profile && !hasUnpaidFee && hasAcceptedAllTenantDocs && ((profile?.companies?.slug !== 'openlead') || (profile?.nda_signed && profile?.subcontractor_signed))

  return (
    <OnboardingContext.Provider value={{ isComplete, isLoading }}>
      {children}
      <PaymentModal
        isOpen={showPaymentModal}
        feeAmount={profile?.signup_fee || 0}
        feeCurrency={profile?.signup_fee_currency || 'GBP'}
        feeBreakdown={profile?.fee_breakdown || []}
        legalDocuments={profile?.companies?.legal_documents || []}
        onPay={handlePaySignupFee}
      />
      <AgreementModal
        isOpen={showModal}
        title={currentStep === 1 ? 'Non-Disclosure Agreement' : 'Subcontractor Agreement'}
        content={currentStep === 1 ? NDA_CONTENT : SUBCONTRACTOR_CONTENT}
        onSign={handleSign}
        step={currentStep}
        totalSteps={2}
      />
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
