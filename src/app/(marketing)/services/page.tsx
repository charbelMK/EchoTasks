
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

const tiers = [
    {
        name: 'Project-Based Service',
        description: 'For one-off projects like building a house or buying a car.',
        features: [
            'Fixed-fee project management',
            'End-to-end oversight',
            'Perfect for specific goals',
            'Milestone-based payments',
        ],
        cta: 'Start a Project',
        variant: 'gray',
    },
    {
        name: 'Retainer Model',
        description: 'For ongoing property or asset management.',
        features: [
            'Monthly flat fee',
            'Regular check-ins & reports',
            'Proactive maintenance alerts',
            'Tenant management',
        ],
        cta: 'Get Maintenance',
        variant: 'gray',
    },
    {
        name: 'Total Peace of Mind',
        description: 'All-inclusive solution for complete family and asset care.',
        features: [
            'Project management + legal access',
            'Annual audits',
            'Priority support',
            'Family emergency response',
        ],
        cta: 'Get Full Coverage',
        variant: 'primary',
    },
]

const processSteps = [
    { id: 1, title: 'Consultation', desc: 'We listen to your goals and understand your vision.' },
    { id: 2, title: 'Blueprint', desc: 'We create a transparent plan & budget for your approval.' },
    { id: 3, title: 'Execution', desc: 'Live updates, photos, and verification as work happens.' },
    { id: 4, title: 'Handover', desc: 'Complete documentation and verification of results.' },
    { id: 5, title: 'Stewardship', desc: 'Ongoing relationship and maintenance support.' },
]

export default function ServicesPage() {
    return (
        <div className="bg-gray-50">


            {/* Service Tiers */}
            <div className="py-24 bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="sm:text-center">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Service Tiers
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-indigo-100 sm:mx-auto">
                            Choose the level of oversight that fits your needs.
                        </p>
                    </div>

                    <div className="mt-20 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
                        {tiers.map((tier) => (
                            <div
                                key={tier.name}
                                className={`relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col ${tier.variant === 'primary' ? 'ring-4 ring-accent ring-opacity-50 scale-105 z-10' : ''
                                    }`}
                            >
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                                    <p className="mt-4 flex items-baseline text-gray-500">
                                        {tier.description}
                                    </p>
                                    <ul className="mt-6 space-y-4">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex">
                                                <Check className="flex-shrink-0 w-5 h-5 text-accent" aria-hidden="true" />
                                                <span className="ml-3 text-gray-500">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Link
                                    href="/contact"
                                    className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${tier.variant === 'primary'
                                        ? 'bg-primary text-white hover:bg-blue-800'
                                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                        }`}
                                >
                                    {tier.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Process Visualization */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="sm:text-center mb-16">
                        <h2 className="text-base text-accent font-semibold tracking-wide uppercase">
                            Our Process
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Your Journey to Peace of Mind
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" />

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            {processSteps.map((step) => (
                                <div key={step.id} className="relative bg-white lg:bg-transparent p-6 lg:p-0 rounded-lg shadow-sm lg:shadow-none border lg:border-none border-gray-100">
                                    <div className="flex items-center justify-center lg:block text-center relative z-10">
                                        <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-white lg:border-gray-50">
                                            {step.id}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                        <p className="text-sm text-gray-500">{step.desc}</p>
                                    </div>
                                    {/* Arrow for Mobile */}
                                    <div className="lg:hidden flex justify-center mt-4">
                                        {step.id !== 5 && <ArrowRight className="text-gray-300 transform rotate-90" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent hover:bg-green-600 md:py-4 md:text-lg md:px-10"
                        >
                            Start Your Journey
                        </Link>
                    </div>
                </div>
            </div>


        </div>
    )
}
