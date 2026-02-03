import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { FileText, Users, Folder, AlertCircle, Clock, CheckCircle, RefreshCw, Bell } from 'lucide-react'
import AdminActivityFeed from './components/AdminActivityFeed'
import AdminTimeline from './components/AdminTimeline'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Parallel fetch for basic stats
    const [
        { count: requestCount },
        { count: approvalCount },
        { count: activeCount },
        { count: changeCount },
        { count: clientCount }
    ] = await Promise.all([
        supabase.from('project_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('projects').select('*', { count: 'exact', head: true }).in('status', ['draft', 'proposal_ready']),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('change_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client')
    ])

    // "At Risk" Logic: Projects with OVERDUE pending milestones
    // We need to fetch pending milestones where due_date < now
    const now = new Date().toISOString()
    const { data: riskData } = await supabase
        .from('milestones')
        .select('project_id')
        .eq('status', 'pending')
        .lt('due_date', now)

    // Get unique project IDs from the overdue milestones to count how many PROJECTS are at risk
    const atRiskProjectIds = new Set(riskData?.map(m => m.project_id))
    const atRiskCount = atRiskProjectIds.size

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Operational view for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Stats & Projects - Spans 2 cols */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                        {/* New Requests */}
                        <Link href="/admin/requests" className="block group">
                            <div className="bg-rose-600 rounded-xl shadow-lg p-5 text-white flex flex-col justify-between h-40 relative overflow-hidden transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-xl">
                                <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                                    <FileText className="h-32 w-32" />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-white text-opacity-90 font-medium text-sm">New Request</h3>
                                    <p className="text-white text-opacity-80 text-xs mt-1">Action Required</p>
                                </div>
                                <div className="relative z-10 flex items-end justify-between">
                                    <span className="text-5xl font-bold">{requestCount || 0}</span>
                                    {/* Icon container removed */}
                                </div>
                            </div>
                        </Link>

                        {/* Awaiting Approval */}
                        <Link href="/admin/projects" className="block group">
                            <div className="bg-amber-500 rounded-xl shadow-lg p-5 text-white flex flex-col justify-between h-40 relative overflow-hidden transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-xl">
                                <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                                    <Clock className="h-32 w-32" />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-white text-opacity-90 font-medium text-sm">Awaiting Approval</h3>
                                    <p className="text-white text-opacity-80 text-xs mt-1">Pending Client Action</p>
                                </div>
                                <div className="relative z-10 flex items-end justify-between">
                                    <span className="text-5xl font-bold">{approvalCount || 0}</span>
                                    {/* Icon container removed */}
                                </div>
                            </div>
                        </Link>

                        {/* Active Projects */}
                        <Link href="/admin/projects" className="block group">
                            <div className="bg-emerald-600 rounded-xl shadow-lg p-5 text-white flex flex-col justify-between h-40 relative overflow-hidden transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-xl">
                                <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                                    <CheckCircle className="h-32 w-32" />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-white text-opacity-90 font-medium text-sm">Active Projects</h3>
                                    <p className="text-white text-opacity-80 text-xs mt-1">In Progress</p>
                                </div>
                                <div className="relative z-10 flex items-end justify-between">
                                    <span className="text-5xl font-bold">{activeCount || 0}</span>
                                    {/* Icon container removed */}
                                </div>
                            </div>
                        </Link>

                        {/* Change Requests */}
                        <Link href="/admin/changes" className="block group">
                            <div className="bg-orange-600 rounded-xl shadow-lg p-5 text-white flex flex-col justify-between h-40 relative overflow-hidden transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-xl">
                                <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                                    <RefreshCw className="h-32 w-32" />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-white text-opacity-90 font-medium text-sm">Change Requests</h3>
                                    <p className="text-white text-opacity-80 text-xs mt-1">Needs Review</p>
                                </div>
                                <div className="relative z-10 flex items-end justify-between">
                                    <span className="text-5xl font-bold">{changeCount || 0}</span>
                                    {/* Icon container removed */}
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Timeline Preview (Real Data) */}
                    <AdminTimeline />
                </div>

                {/* Right Column: Stats Feed & Risk */}
                <div className="space-y-6">
                    {/* At Risk Card */}
                    <div className="bg-slate-800 rounded-xl shadow-lg p-6 text-white overflow-hidden relative group">
                        <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-15 transition-opacity">
                            <AlertCircle className="h-40 w-40 transform translate-x-10 -translate-y-10" />
                        </div>
                        <h3 className="text-red-400 font-medium text-sm">Projects At Risk</h3>
                        <div className="flex items-center mt-2">
                            <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
                            <span className="text-4xl font-bold">{atRiskCount}</span>
                        </div>
                        <p className="text-slate-400 text-sm mt-1">Projects with overdue milestones</p>
                        {atRiskCount > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <Link href="/admin/projects" className="text-sm text-red-400 hover:text-red-300 transition-colors">View Details &rarr;</Link>
                            </div>
                        )}
                    </div>

                    {/* Recent Activity (Real Data) */}
                    <AdminActivityFeed />
                </div>
            </div>
        </div>
    )
}
