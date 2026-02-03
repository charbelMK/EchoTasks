
import Image from 'next/image'
import { User, Users } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="bg-white">


            {/* Story Section */}
            <div className="py-16 bg-white overflow-hidden lg:py-24">
                <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
                    <div className="relative">
                        <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Born from Frustration, Built on Trust
                        </h2>
                        <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
                            We started EchoTasks after seeing too many diaspora friends lose money, sleep, and trust trying to manage Kenya from afar. We knew there had to be a better way—one built on radical transparency, not just promises.
                        </p>
                    </div>

                    <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                        <div className="relative">
                            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                                Our Mission
                            </h3>
                            <p className="mt-3 text-lg text-gray-500">
                                To serve as the trusted bridge for global citizens, ensuring that distance never compromises the quality, security, or success of your projects back home.
                            </p>

                            <dl className="mt-10 space-y-10">
                                {[
                                    { label: 'Integrity', desc: 'We report the truth, always. Bad news implies we are doing our job.' },
                                    { label: 'Transparency', desc: 'You see what we see, in real-time via your portal.' },
                                    { label: 'Efficiency', desc: 'We get things done on time and avoid the "Kenyan time" trap.' },
                                ].map((item) => (
                                    <div key={item.label} className="relative">
                                        <dt>
                                            <p className="text-lg leading-6 font-medium text-gray-900">{item.label}</p>
                                        </dt>
                                        <dd className="mt-2 text-base text-gray-500">
                                            {item.desc}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
                            <div className="relative mx-auto rounded-lg shadow-lg overflow-hidden bg-gray-100 aspect-square max-w-md">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                                    <Image
                                        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800"
                                        alt="Team collaboration"
                                        fill
                                        className="object-cover opacity-50"
                                    />
                                    <span className="relative z-10 font-bold text-gray-800">Mission: Bridging the Distance</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-gray-50 py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                            Meet Your Bridge Builders
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            A team that understands both the diaspora experience and the ground reality in Kenya.
                        </p>
                    </div>
                    <div className="mt-12 max-w-4xl mx-auto">
                        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                            {[
                                {
                                    name: 'The Founder',
                                    role: 'Vision & Strategy',
                                    bio: 'A diaspora native ensuring that distance never compromises the quality of your projects back home. Understanding the pain points firsthand.',
                                    icon: User
                                },
                                {
                                    name: 'The Network',
                                    role: 'Execution & Logistics',
                                    bio: 'Our vetted network of professionals on the ground—lawyers, contractors, and runners—who get the job done efficiently and transparently.',
                                    icon: Users
                                },
                            ].map((person) => (
                                <li key={person.name} className="bg-white rounded-lg shadow overflow-hidden text-center py-10 px-6">
                                    <div className="space-y-4">
                                        <div className="h-24 w-24 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <person.icon size={40} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-xs font-medium lg:text-sm">
                                                <h3 className="text-lg font-medium text-gray-900">{person.name}</h3>
                                                <p className="text-indigo-600">{person.role}</p>
                                            </div>
                                            <p className="text-base text-gray-500">{person.bio}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>


        </div>
    )
}
