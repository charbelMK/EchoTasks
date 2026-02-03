'use client'

import { ShieldCheck, Lock, Globe, Mail, Phone, MapPin, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { submitContactForm } from '@/app/actions/contact'

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        try {
            const result = await submitContactForm(formData)

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Request Sent!", {
                    description: "We've received your request and will be in touch shortly.",
                    duration: 5000,
                })
                // Optional: Reset form here if we had a ref
                // For now, we rely on the user seeing the success message
                // Cast to any to access reset() method on form element
                const formElement = document.getElementById('contact-form') as HTMLFormElement
                if (formElement) formElement.reset()
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-indigo-900 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Let&apos;s Build Your Bridge Home
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-indigo-200 max-w-2xl mx-auto">
                        Ready to start your project? Tell us about your needs and we&apos;ll schedule a consultation to discuss how we can help.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-5">

                    {/* Contact Info Side */}
                    <div className="bg-indigo-600 p-8 lg:col-span-2 text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                            <ul className="space-y-6">
                                <li className="flex items-start">
                                    <Mail className="h-6 w-6 mr-4 opacity-80" />
                                    <span>info@echotasks.co.ke</span>
                                </li>
                                <li className="flex items-start">
                                    <Phone className="h-6 w-6 mr-4 opacity-80" />
                                    <span>+254 712 278 079</span>
                                </li>
                                <li className="flex items-start">
                                    <MapPin className="h-6 w-6 mr-4 opacity-80" />
                                    <span>Nairobi, Kenya</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-12">
                            <div className="flex space-x-4 mb-8">
                                <ShieldCheck className="h-8 w-8 opacity-60" />
                                <Globe className="h-8 w-8 opacity-60" />
                                <Lock className="h-8 w-8 opacity-60" />
                            </div>
                            <p className="text-sm text-indigo-200">
                                Trusted by Kenyans in the Diaspora across USA, UK, Canada, Australia and Europe.
                            </p>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-8 lg:p-12 lg:col-span-3">
                        <form id="contact-form" action={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                            <div>
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        required
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md bg-gray-50 border text-gray-900"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        autoComplete="email"
                                        required
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md bg-gray-50 border text-gray-900"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Phone (Optional)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        autoComplete="tel"
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md bg-gray-50 border text-gray-900"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                    Current Location
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="location"
                                        name="location"
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md bg-gray-50 border text-gray-900"
                                    >
                                        <option>USA</option>
                                        <option>UK</option>
                                        <option>Canada</option>
                                        <option>Australia</option>
                                        <option>Europe (Other)</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="project-type" className="block text-sm font-medium text-gray-700">
                                    Project Type
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="project-type"
                                        name="project-type"
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md bg-gray-50 border text-gray-900"
                                    >
                                        <option>Property Construction/Renovation</option>
                                        <option>Asset Management</option>
                                        <option>Family Support</option>
                                        <option>Legal Consultation</option>
                                        <option>Bespoke Errand</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Project Details & Preferred Consultation Time
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        required
                                        placeholder="Tell us what you need help with and when you're available to talk."
                                        className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                            Sending Request...
                                        </>
                                    ) : (
                                        'Request Consultation'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center px-4">
                    <div className="p-4">
                        <h4 className="font-semibold text-gray-900">Registered & Compliant</h4>
                        <p className="text-sm text-gray-500 mt-1">Legally registered business in Kenya.</p>
                    </div>
                    <div className="p-4">
                        <h4 className="font-semibold text-gray-900">Global Reach</h4>
                        <p className="text-sm text-gray-500 mt-1">Specializing in Diaspora needs.</p>
                    </div>
                    <div className="p-4">
                        <h4 className="font-semibold text-gray-900">Secure & Transparent</h4>
                        <p className="text-sm text-gray-500 mt-1">Detailed reporting on every cent.</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
