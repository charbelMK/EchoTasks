'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContactForm(formData: FormData) {
    const firstName = formData.get('first-name')
    const email = formData.get('email') as string
    const phone = formData.get('phone')
    const location = formData.get('location')
    const projectType = formData.get('project-type')
    const message = formData.get('message')

    // Validation
    if (!firstName || !email || !message) {
        return { error: 'Please fill in all required fields.' }
    }

    try {
        if (!process.env.RESEND_API_KEY) {
            console.log('⚠️ RESEND_API_KEY is missing. logging to console instead.')
            console.log('To: info@echotasks.co.ke')
            console.log(`From: ${firstName} <${email}>`)
            console.log(`Message: ${message}`)
            // Return success so UI doesn't break during dev
            return { success: true, warning: 'Email mocked (API Key missing)' }
        }

        // Send Email using Resend
        const { data, error } = await resend.emails.send({
            from: 'EchoTasks Contact <onboarding@resend.dev>', // Update this to info@echotasks.co.ke once domain is verified
            to: ['info@echotasks.co.ke'], // The admin email receiving the requests (Must be verified in Resend for testing)
            replyTo: email,
            subject: `New Consultation Request: ${projectType}`,
            text: `
Name: ${firstName}
Email: ${email}
Phone: ${phone || 'N/A'}
Location: ${location}
Project Type: ${projectType}

Message:
${message}
            `,
            // You can also add an implementation for 'react' property here for formatted HTML emails
        })

        if (error) {
            console.error('Resend Error:', error)
            return { error: error.message }
        }

        return { success: true }
    } catch (err) {
        console.error('Submission Error:', err)
        return { error: 'Failed to send request.' }
    }
}
