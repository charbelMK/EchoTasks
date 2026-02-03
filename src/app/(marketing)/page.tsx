import Hero from '@/components/marketing/hero'

import Testimonials from '@/components/marketing/testimonials'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Shield, MapPin, FileText } from 'lucide-react'

// Value Props Data
const valueProps = [
  {
    icon: '🏡',
    title: 'Property & Construction',
    desc: 'From land buying to building, fencing, your dream home and/or property. We handle every nail, every contract, every update.'
  },
  {
    icon: '🚗',
    title: 'Asset Management',
    desc: 'Buying, maintaining, or selling property? We are your eyes and feet on the ground. Landscaping, farming, maintenance - no guesswork.'
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Family Support',
    desc: 'From school fees to legal documents. We care for what matters most to you, with full accountability.'
  },
  {
    icon: '🚀',
    title: 'Bespoke Errand Tasks',
    desc: "Tell us what you want done (legal) and we'll rocket there, and handle it like you would: we adhere to your exact instructions."
  }
]

// Assurance features
const assuranceFeatures = [
  { text: 'Live Verification: Geotagged photos & video walkthroughs', icon: MapPin },
  { text: 'Full Transparency: Every receipt, every update in your portal', icon: FileText },
  { text: 'Dedicated Steward: One person owns your project from start to finish', icon: Shield },
  { text: 'Quality Guaranteed: Independent verification before final payment', icon: CheckCircle },
]

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Hero />

      {/* Value Proposition Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-accent font-semibold tracking-wide uppercase">Our Services</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Complete Oversight for Diaspora
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assurance Framework (Feature Section) */}
      <section className="py-20 bg-primary overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Why We're Different: The Assurance Framework™
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {assuranceFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-4 bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <feature.icon className="flex-shrink-0 h-6 w-6 text-accent" />
                <p className="text-lg font-medium text-white">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Final CTA */}
      <section className="bg-accent">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
            Ready to reclaim your peace of mind?
          </h2>
          <p className="text-xl text-green-900 mb-8 font-medium">
            Join hundreds of Kenyans in the diaspora who trust EchoTasks.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-md text-accent bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Get Your Free Consultation
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
