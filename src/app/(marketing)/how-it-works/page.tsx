
import { CheckCircle, Phone, FileText, Search, Hammer, Video, ShieldCheck, HeartHandshake } from 'lucide-react'

const phases = [
    {
        id: 1,
        title: 'PHASE 1: CLARIFY & BLUEPRINT',

        goal: 'To achieve absolute alignment and create a crystal-clear plan of action.',
        steps: [
            {
                icon: Phone,
                title: 'Step 1: The Discovery Call',
                details: [
                    'What Happens: A 30-45 min video/audio call with your Project Steward.',
                    'Focus: We explore the goal. Why is this project important? What does success look like?',
                    'Output: A shared understanding of your vision and success metrics.'
                ]
            },
            {
                icon: FileText,
                title: 'Step 2: The Transparent Proposal & Budget',
                details: [
                    'What Happens: Within 48 hours, you receive a detailed proposal.',
                    'Includes: Project Scope, Fixed Echo Tasks Fee, Line-item Vendor Cost Estimates, High-level Timeline.',
                    'Output: A fixed-price quote. No hidden fees, no surprises.'
                ]
            },
            {
                icon: CheckCircle,
                title: 'Step 3: The Digital Handshake',
                details: [
                    'What Happens: You digitally sign the agreement. We invite you to your Client Portal.',
                    'Output: Project kick-off. Your portal becomes the single source of truth.'
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'PHASE 2: EXECUTE & VERIFY',

        goal: 'To become your eyes and ears on the ground, providing live, verifiable proof.',
        steps: [
            {
                icon: Hammer,
                title: 'Step 4: Launch & Mobilization',
                details: [
                    'What Happens: We deploy vetted partners (contractors, agents) based on the blueprint.',
                    'Output: Work begins on schedule.'
                ]
            },
            {
                icon: Video,
                title: 'Step 5: The Rhythm of Transparency',
                details: [
                    'Weekly Preview: Every Monday, you get a "This Week at a Glance".',
                    'Live Verification: Geotagged photos, video walkthroughs, and live calls for major decisions.',
                    'Real-Time Docs: Receipts, invoices, and contracts uploaded immediately.',
                    'Weekly Recap: Every Friday, a formal update on what was accomplished.'
                ]
            }
        ]
    },
    {
        id: 3,
        title: 'PHASE 3: VALIDATE & CONCLUDE',

        goal: 'To independently verify quality and formally close the project.',
        steps: [
            {
                icon: Search,
                title: 'Step 6: The Quality Gate',
                details: [
                    'What Happens: Independent expert inspection (e.g., engineer, mechanic) against scope.',
                    'Output: A third-party quality assurance report.'
                ]
            },
            {
                icon: ShieldCheck,
                title: 'Step 7: Final Reconciliation & Handover',
                details: [
                    'What Happens: We compile the Final Reconciliation Report (Budget vs Spend) and Digital Asset Portfolio.',
                    'Output: A complete, organized asset history. Unused funds refunded.'
                ]
            }
        ]
    },
    {
        id: 4,
        title: 'PHASE 4: STEWARD & SUSTAIN',

        goal: 'To transition from service provider to long-term steward.',
        steps: [
            {
                icon: HeartHandshake,
                title: 'Step 8: Strategic Review',
                details: [
                    'What Happens: Final call to review, gather feedback, and discuss future needs.',
                    'Output: A solidified partnership.'
                ]
            },
            {
                icon: ShieldCheck,
                title: 'Step 9: "Peace of Mind" Check-ins',
                details: [
                    'Optional Retainer: Regular site visits, maintenance checks, and performance reports.',
                    'Output: Long-term asset protection.'
                ]
            }
        ]
    }
]

export default function HowItWorksPage() {
    return (
        <div className="bg-gray-50 min-h-screen">


            {/* Hero Section */}
            <div className="bg-primary py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                        The Echo Tasks Assurance Framework™
                    </h1>
                    <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
                        Our Promise: A predictable, transparent, and stress-free experience from your first message to project completion and beyond.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Phases */}
                <div className="space-y-16">
                    {phases.map((phase) => (
                        <div key={phase.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mt-1">{phase.title}</h2>
                                </div>
                                <div className="mt-2 sm:mt-0 max-w-md text-sm text-gray-500 italic">
                                    &quot;{phase.goal}&quot;
                                </div>
                            </div>

                            <div className="p-6 sm:p-8">
                                <div className="space-y-12">
                                    {phase.steps.map((step) => (
                                        <div key={step.title} className="flex">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-50 text-primary">
                                                    <step.icon className="h-6 w-6" aria-hidden="true" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">{step.title}</h3>
                                                <ul className="mt-2 text-base text-gray-500 space-y-2 list-disc pl-5">
                                                    {step.details.map((detail, idx) => (
                                                        <li key={idx}>{detail}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Benefits Summary */}
                <div className="mt-20 bg-primary rounded-2xl p-8 sm:p-12 text-white text-center">
                    <h2 className="text-3xl font-bold mb-8">Why This Process Feels Predictable</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                        <div className="bg-white/10 p-6 rounded-lg">
                            <h3 className="font-bold text-accent mb-2">1. No Surprises</h3>
                            <p className="text-indigo-100 text-sm">The Clarify phase locks in scope, cost, and timeline upfront.</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-lg">
                            <h3 className="font-bold text-accent mb-2">2. No Guesswork</h3>
                            <p className="text-indigo-100 text-sm">The Execute phase provides a constant, verifiable stream of evidence.</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-lg">
                            <h3 className="font-bold text-accent mb-2">3. No Doubt</h3>
                            <p className="text-indigo-100 text-sm">The Validate phase uses independent checks to guarantee quality.</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-lg md:col-span-1 lg:col-span-1 lg:col-start-2">
                            <h3 className="font-bold text-accent mb-2">4. No Loose Ends</h3>
                            <p className="text-indigo-100 text-sm">The Conclude phase ensures a clean, documented handover.</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-lg md:col-span-1 lg:col-span-1">
                            <h3 className="font-bold text-accent mb-2">5. No Abandonment</h3>
                            <p className="text-indigo-100 text-sm">The Steward phase shows we are invested in your long-term success.</p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <p className="text-xl mb-8">
                            You don&apos;t just hope for a good outcome; you can see it being built, step by verifiable step.
                        </p>
                        <a href="/contact" className="inline-block bg-white text-primary font-bold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors">
                            Start Your Project
                        </a>
                    </div>
                </div>

            </div>

        </div>
    )
}
