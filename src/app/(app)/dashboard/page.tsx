import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Clock, CheckCircle, Activity, ArrowRight, Bell } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch Projects with Milestones
    const { data: projects } = await supabase
        .from('projects')
        .select('*, milestones(*)')
        .eq('client_id', user.id)
        .order('updated_at', { ascending: false })

    // Fetch Recent Notifications
    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    // Calculate Stats
    const totalProjects = projects?.length || 0
    const activeProjects = projects?.filter(p => p.status === 'in_progress' || p.status === 'pending') || []
    const completedProjects = projects?.filter(p => p.status === 'completed') || []
    const pendingProjects = projects?.filter(p => p.status === 'pending' || p.status === 'draft' || p.status === 'proposal_ready') || []

    return (
        <div className="space-y-8">
            {/* 1. Welcome Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Here’s the current status of your projects.
                </p>
            </div>
            <div className="flex justify-end">
                <Link
                    href="/dashboard/request"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <CheckCircle className="mr-2 h-4 w-4" /> Start a New Project
                </Link>
            </div>

            {/* 2. Key Stats (Small Cards) */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Activity className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                                    <dd className="text-lg font-medium text-gray-900">{activeProjects.length}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                                    <dd className="text-lg font-medium text-gray-900">{completedProjects.length}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Clock className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                    <dd className="text-lg font-medium text-gray-900">{pendingProjects.length}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Proposal Alerts */}
                {(projects?.filter(p => p.status === 'draft' || p.status === 'proposal_ready').length || 0) > 0 && (
                    <div className="mb-8 lg:col-span-2">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Proposals</h2>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="space-y-4">
                                {projects?.filter(p => p.status === 'draft' || p.status === 'proposal_ready').map(project => (
                                    <div key={project.id} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <Clock className="h-5 w-5 text-yellow-400" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-yellow-800">
                                                    {project.title}
                                                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        {project.status === 'draft' ? 'Drafting' : 'Ready for Review'}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-yellow-700">
                                                    {project.status === 'proposal_ready'
                                                        ? 'The proposal is ready. Please review and approve.'
                                                        : 'Our team is currently drafting the proposal.'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <Link href={`/dashboard/projects/${project.id}`} className="font-medium text-yellow-700 hover:text-yellow-600 hover:underline">
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Project Summary Cards (Active) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Active Projects</h2>
                        <Link href="/dashboard/projects" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            View all
                        </Link>
                    </div>

                    {activeProjects.slice(0, 3).map((project) => {
                        // Calculate progress
                        // @ts-ignore
                        const milestones = project.milestones || []
                        // @ts-ignore
                        const completedCount = milestones.filter(m => m.status === 'completed').length
                        const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0

                        return (
                            <div key={project.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                <Link href={`/dashboard/projects/${project.id}`} className="hover:underline">
                                                    {project.title}
                                                </Link>
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
                                        </div>
                                        <span className={`ml-4 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <div className="relative pt-1">
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                                                <div style={{ width: `${progress}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Link
                                                href={`/dashboard/projects/${project.id}`}
                                                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                            >
                                                View Details <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {activeProjects.length === 0 && (
                        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                            No active projects. <Link href="/dashboard/request" className="text-indigo-600 hover:underline">Start a new one?</Link>
                        </div>
                    )}
                </div>

                {/* 4. Recent Updates Feed */}
                <div className="lg:col-span-1">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Updates</h2>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {notifications?.map((notification) => (
                                <li key={notification.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex space-x-3">
                                        <Bell className="h-5 w-5 text-gray-400" />
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-medium">{notification.title}</h3>
                                                <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <p className="text-sm text-gray-500">{notification.message}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {(!notifications || notifications.length === 0) && (
                                <li className="p-4 text-center text-sm text-gray-500">No recent updates.</li>
                            )}
                        </ul>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                            <Link href="/dashboard/notifications" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 block text-center">
                                View all notifications
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
