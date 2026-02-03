'use client'


import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

// Mock Data
const caseStudies = [
    {
        id: 1,
        client: 'Faith (UK-based)',
        project: 'Abandoned Land to Income-Generating Homestead',
        description: 'Faith inherited land in upcountry Kenya but it sat idle for years. Squatters were encroaching. We secured the perimeter, built a farmhouse, and planted fruit trees. It now generates rental income.',
        results: [
            '3-month project completed on budget',
            'Secure fencing & gate installed',
            'Generating 50k KES monthly rental income'
        ],
        quote: "EchoTasks didn't just build a house; they built my confidence in managing Kenya from abroad.",
        beforeImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1000', // Placeholder
        afterImage: 'https://images.unsplash.com/photo-1600596542815-afaad110a630?auto=format&fit=crop&q=80&w=1000' // Placeholder
    }
]

export default function CaseStudiesPage() {
    return (
        <div className="bg-white">


            <div className="bg-primary py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-base text-accent font-semibold tracking-wide uppercase">Success Stories</h2>
                    <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                        See Real Results
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                {caseStudies.map((study) => (
                    <div key={study.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-16">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-0">
                            {/* Content */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                                    <span className="font-semibold text-primary">{study.client}</span>
                                    <span>•</span>
                                    <span>{study.project}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Transformation Story
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {study.description}
                                </p>

                                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                    <h4 className="font-semibold text-gray-900 mb-3">Key Results</h4>
                                    <ul className="space-y-2">
                                        {study.results.map((result, i) => (
                                            <li key={i} className="flex items-start">
                                                <span className="text-accent mr-2">•</span>
                                                <span className="text-gray-600 text-sm">{result}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <blockquote className="relative">
                                    <Quote className="absolute -top-4 -left-4 text-gray-200 h-10 w-10 opacity-50" />
                                    <p className="italic text-gray-600 pl-6 border-l-4 border-accent">
                                        {study.quote}
                                    </p>
                                </blockquote>
                            </div>

                            {/* Visuals (Before/After Slider Concept - simplified to split view for v1) */}
                            <div className="bg-gray-100 relative h-96 lg:h-auto">
                                <div className="absolute inset-0 grid grid-rows-2 h-full">
                                    <div className="relative h-full">
                                        <Image
                                            src={study.beforeImage}
                                            alt="Before transformation"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            BEFORE
                                        </div>
                                    </div>
                                    <div className="relative h-full">
                                        <Image
                                            src={study.afterImage}
                                            alt="After transformation"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-4 left-4 bg-accent text-white text-xs px-2 py-1 rounded">
                                            AFTER
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="text-center mt-12">
                    <p className="text-gray-500 mb-6">Want to be our next success story?</p>
                    <a href="/contact" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-blue-800">
                        Start Your Project
                    </a>
                </div>
            </main>


        </div>
    )
}
