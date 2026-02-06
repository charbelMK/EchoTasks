import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand & Newsletter */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/">
                            <Image
                                src="/logo-v3.png"
                                alt="EchoTasks Logo"
                                width={200}
                                height={60}
                                className="h-12 w-auto mb-4"
                            />
                        </Link>
                        <p className="text-gray-500 text-sm mb-4">
                            Your trusted bridge for managing projects, property, and family needs in Kenya from abroad.
                        </p>
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-2">
                                Get Diaspora Tips
                            </h4>
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary focus:placeholder-gray-400 sm:max-w-xs"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-primary border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:w-auto"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                            Quick Links
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link href="/services" className="text-base text-gray-500 hover:text-gray-900">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/how-it-works" className="text-base text-gray-500 hover:text-gray-900">
                                    Our Process
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-base text-gray-500 hover:text-gray-900">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Service Areas */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                            Service Areas
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link href="/services" className="text-base text-gray-500 hover:text-gray-900">
                                    Property & Construction
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="text-base text-gray-500 hover:text-gray-900">
                                    Asset Management
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="text-base text-gray-500 hover:text-gray-900">
                                    Family Support
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="text-base text-gray-500 hover:text-gray-900">
                                    Legal Consultation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                            Contact Us
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <li className="flex items-center">
                                <span className="text-base text-gray-500">
                                    Nairobi, Kenya
                                </span>
                            </li>
                            <li>
                                <a href="mailto:info@echotasks.co.ke" className="text-base text-gray-500 hover:text-gray-900">
                                    info@echotasks.co.ke
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://wa.me/254712278079"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-accent hover:text-green-600 font-medium"
                                >
                                    Chat on WhatsApp
                                </a>
                            </li>
                        </ul>
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-2">
                                Trusted by Kenyans in
                            </h4>
                            <div className="flex gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    USA
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    UK
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Canada
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <p className="text-base text-gray-400 xl:text-center">
                        &copy; {new Date().getFullYear()} EchoTasks. All rights reserved. Registered Business in Kenya.
                    </p>
                </div>
            </div>
        </footer>
    )
}
