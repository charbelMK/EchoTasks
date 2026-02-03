import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Calendar, CheckCircle, Clock } from 'lucide-react'

export default async function ClientProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>
}) {
    const params = await searchParams
    const statusFilter = params?.status || 'all'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    let query = supabase
        .from('projects')
        .select('*, milestones(status)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

    if (statusFilter === 'active') {
        query = query.in('status', ['in_progress', 'pending', 'draft', 'proposal_ready'])
    } else if (statusFilter === 'completed') {
        query = query.eq('status', 'completed')
    }

    const { data: projects } = await query

    const tabs = [
        { name: 'All Projects', href: '/dashboard/projects', current: statusFilter === 'all' },
        { name: 'Active', href: '/dashboard/projects?status=active', current: statusFilter === 'active' },
        { name: 'Completed', href: '/dashboard/projects?status=completed', current: statusFilter === 'completed' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
                <div className="mt-3 sm:mt-0">
                    <nav className="flex space-x-4" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={`px-3 py-2 font-medium text-sm rounded-md ${tab.current
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                aria-current={tab.current ? 'page' : undefined}
                            >
                                {tab.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects?.map((project) => {
                    // Calculate Real Progress
                    // @ts-ignore
                    const milestones = project.milestones || []
                    const totalMilestones = milestones.length
                    // @ts-ignore
                    const completedMilestones = milestones.filter(m => m.status === 'completed').length
                    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

                    return (
                        <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg flex flex-col">
                            <div className="p-5 flex-1">
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                            project.status === 'proposal_ready' ? 'bg-purple-100 text-purple-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {project.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">
                                    <Link href={`/dashboard/projects/${project.id}`} className="hover:underline">
                                        {project.title}
                                    </Link>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 line-clamp-3">
                                    {project.description}
                                </p>
                                <div className="mt-4 flex items-center text-sm text-gray-500">
                                    <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                    Started {new Date(project.created_at).toLocaleDateString()}
                                </div>
                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs font-medium text-gray-900 mb-1">
                                        <span>Progress</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${project.status === 'completed' ? 'bg-green-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <Link
                                    href={`/dashboard/projects/${project.id}`}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-center"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>

            {(!projects || projects.length === 0) && (
                <div className="text-center py-12">
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
            )}
        </div>
    )
}
