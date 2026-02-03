import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import LogoutButton from '@/components/logout-button'
import SessionTimeout from '@/components/common/SessionTimeout'
import AdminSearchBar from './admin/components/AdminSearchBar'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // ... (rest of the file until the logo part)

    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check profile for admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        // Not an admin, redirect to client dashboard or unauthorized page
        redirect('/dashboard')
    }

    // Fetch counts for sidebar badges
    const [
        { count: pendingRequestsCount },
        { count: activeProjectsCount },
        { count: changeRequestsCount }
    ] = await Promise.all([
        supabase.from('project_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('change_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ])

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SessionTimeout />

            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex md:w-72 md:flex-col fixed inset-y-0 z-50 bg-[#1e293b]">
                {/* Logo Area */}
                <div className="flex items-center h-16 flex-shrink-0 px-6 bg-[#0f172a]">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">ECHO TASKS</span>
                    </div>
                </div>

                {/* Sidebar Nav */}
                <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
                    <nav className="flex-1 px-4 space-y-2">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                            Overview
                        </div>
                        <Link href="/admin" className="bg-indigo-600/10 text-indigo-400 group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg border-l-4 border-indigo-500 transition-all">
                            <span className="w-5 mr-3">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </span>
                            Dashboard
                        </Link>

                        <div className="pt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                            Project Management
                        </div>

                        <Link href="/admin/requests" className="text-slate-300 hover:bg-slate-800 hover:text-white group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors">
                            <span className="w-5 mr-3">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </span>
                            Project Requests
                            {(pendingRequestsCount ?? 0) > 0 && (
                                <span className="ml-auto bg-red-500 text-white py-0.5 px-2 rounded-full text-xs">{pendingRequestsCount}</span>
                            )}
                        </Link>

                        <Link href="/admin/projects" className="text-slate-300 hover:bg-slate-800 hover:text-white group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors">
                            <span className="w-5 mr-3">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </span>
                            Active Projects
                            {(activeProjectsCount ?? 0) > 0 && (
                                <span className="ml-auto bg-indigo-500 text-white py-0.5 px-2 rounded-full text-xs">{activeProjectsCount}</span>
                            )}
                        </Link>

                        <Link href="/admin/changes" className="text-slate-300 hover:bg-slate-800 hover:text-white group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors">
                            <span className="w-5 mr-3">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </span>
                            Change Requests
                            {changeRequestsCount && changeRequestsCount > 0 && (
                                <span className="ml-auto bg-amber-500 text-white py-0.5 px-2 rounded-full text-xs">{changeRequestsCount}</span>
                            )}
                        </Link>

                        <div className="pt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                            Stakeholders
                        </div>

                        <Link href="/admin/clients" className="text-slate-300 hover:bg-slate-800 hover:text-white group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors">
                            <span className="w-5 mr-3">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </span>
                            Clients
                        </Link>

                        <div className="pt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                            System
                        </div>

                        <Link href="/admin/settings" className="text-slate-300 hover:bg-slate-800 hover:text-white group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors">
                            <span className="w-5 mr-3">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </span>
                            Settings
                        </Link>

                    </nav>
                </div>

                {/* User Profile / Logout */}
                <div className="flex-shrink-0 flex border-t border-slate-800 p-4 bg-[#0f172a]">
                    <div className="flex items-center w-full">
                        <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                                A
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">Admin User</p>
                            <p className="text-xs font-medium text-slate-400 group-hover:text-slate-300">View Profile</p>
                        </div>
                        <div className="ml-auto">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 md:pl-72 transition-all duration-300">
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-[#1e293b] shadow-md h-16 flex items-center justify-between px-6">
                    {/* Search Bar */}
                    <AdminSearchBar />

                    {/* Right Side Header Icons */}
                    <div className="ml-4 flex items-center space-x-4">
                        {/* Notification icon removed as per request */}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
