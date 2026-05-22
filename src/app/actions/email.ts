"use server"

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const data = await resend.emails.send({
      from: 'Openlead Academy <academy@openlead.com>',
      to: email,
      subject: 'Welcome to Openlead Academy!',
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h1 style="color: #111827;">Welcome to Openlead Academy, ${name}!</h1>
          <p style="color: #4B5563; font-size: 16px; line-height: 1.5;">
            We are thrilled to have you join our elite sales training program. 
            Your journey to becoming a top performer starts now.
          </p>
          <a href="https://openlead.com/dashboard" style="display: inline-block; background-color: #12C7C1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
      `
    })
    return { success: true, data }
  } catch (error) {
    console.error(error)
    return { success: false, error }
  }
}

export async function sendApplicationConfirmation(email: string, role: string) {
  try {
    const data = await resend.emails.send({
      from: 'Openlead Academy <careers@openlead.com>',
      to: email,
      subject: `Application Received: ${role}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h1 style="color: #111827;">Application Received!</h1>
          <p style="color: #4B5563; font-size: 16px; line-height: 1.5;">
            Thank you for applying for the <strong>${role}</strong> position. 
            Our team will review your profile and get back to you shortly.
          </p>
        </div>
      `
    })
    return { success: true, data }
  } catch (error) {
    console.error(error)
    return { success: false, error }
  }
}
