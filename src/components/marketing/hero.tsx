import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
    return (
        <div className="relative bg-primary overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
                    alt="Modern building in Nairobi"
                    fill
                    className="object-cover object-center opacity-20"
                    priority
                />
                <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
            </div>

            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Your Peace of Mind, Delivered.
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
                    We're the trusted bridge for Kenyans in the diaspora managing projects, property, and family back home. Radical transparency. Guaranteed results.
                </p>
                <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4">
                    <Link
                        href="/contact"
                        className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                        Get Your Free Consultation
                    </Link>
                    <Link
                        href="/how-it-works"
                        className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary/60 hover:bg-primary/70 md:py-4 md:text-lg md:px-10"
                    >
                        See How It Works →
                    </Link>
                </div>
            </div>
        </div>
    )
}
