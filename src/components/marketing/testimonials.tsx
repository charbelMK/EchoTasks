import Image from 'next/image'
import { Star } from 'lucide-react'

const testimonials = [
    {
        content: "Building my mum's retirement home in Ruiru from Seattle was a nightmare until I found EchoTasks. I used to get grainy Whatsapp photos once a month. Now I get a full report weekly. The peace of mind is worth every cent.",
        author: "Sarah K.",
        location: "Seattle, WA, USA",
        role: "Healthcare Professional",
        image: "/avatars/avatar-1.png" // We'll handle missing images gracefully with a fallback or initials
    },
    {
        content: "I needed to sort out some land title issues in Nakuru while stuck in London. EchoTasks handled the lawyers, the registry visits, and the paperwork. They sent me the final title deed via courier. Incredible professionalism.",
        author: "James M.",
        location: "London, UK",
        role: "Financial Analyst",
        image: "/avatars/avatar-2.png"
    },
    {
        content: "It's the small things. I needed someone to check on my rental units in Kileleshwa and manage repairs. EchoTasks is like having a responsible brother on the ground who actually picks up the phone.",
        author: "David O.",
        location: "Perth, Australia",
        role: "Engineer",
        image: "/avatars/avatar-3.png"
    }
]

export default function Testimonials() {
    return (
        <section className="py-20 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-base text-accent font-semibold tracking-wide uppercase">
                        Stories from the Global Community
                    </h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Trusted by Kenyans Worldwide
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
                        >
                            <div className="p-8 flex-1">
                                <div className="flex items-center space-x-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-gray-600 text-lg leading-relaxed mb-6">
                                    &quot;{testimonial.content}&quot;
                                </blockquote>
                            </div>
                            <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center">
                                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
                                    {testimonial.author.charAt(0)}
                                </div>
                                <div className="ml-4">
                                    <div className="text-base font-bold text-gray-900">{testimonial.author}</div>
                                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
