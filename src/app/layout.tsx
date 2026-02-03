import type { Metadata } from 'next'
import { Inter, Open_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
})

export const metadata: Metadata = {
  title: 'EchoTasks - Project Management for the Diaspora',
  description: 'Managed projects, property, and errands in Kenya for the global diaspora.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${openSans.variable} antialiased`}>
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
