import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
                <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
                    <div className="flex items-center">
                        <Link href="/">
                            <span className="sr-only">EchoTasks</span>
                            <Image
                                src="/logo-v3.png"
                                alt="EchoTasks Logo"
                                width={200} // Adjusted for visibility
                                height={60}
                                className="h-14 w-auto transition-transform duration-300 hover:scale-105"
                            />
                        </Link>
                        <div className="hidden ml-10 space-x-8 lg:block">
                            <Link href="/services" className="text-base font-medium text-gray-500 hover:text-gray-900">
                                Services
                            </Link>
                            <Link href="/how-it-works" className="text-base font-medium text-gray-500 hover:text-gray-900">
                                How It Works
                            </Link>
                            <Link href="/about" className="text-base font-medium text-gray-500 hover:text-gray-900">
                                About
                            </Link>
                            <Link href="/contact" className="text-base font-medium text-gray-500 hover:text-gray-900">
                                Contact
                            </Link>
                        </div>
                    </div>
                    <div className="ml-10 space-x-4">

                        <Link
                            href="/admin/projects"
                            className="inline-block bg-indigo-50 py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-100"
                        >
                            Client Dashboard
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-block bg-indigo-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-indigo-700"
                        >
                            Start a Project
                        </Link>
                    </div>
                </div>
                <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
                    <Link href="/services" className="text-base font-medium text-gray-500 hover:text-gray-900">
                        Services
                    </Link>
                    <Link href="/how-it-works" className="text-base font-medium text-gray-500 hover:text-gray-900">
                        How It Works
                    </Link>
                    <Link href="/about" className="text-base font-medium text-gray-500 hover:text-gray-900">
                        About
                    </Link>
                    <Link href="/contact" className="text-base font-medium text-gray-500 hover:text-gray-900">
                        Contact
                    </Link>
                </div>
            </nav>
        </header>
    )
}
