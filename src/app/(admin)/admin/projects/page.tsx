import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function ProjectsPage() {
    const supabase = await createClient()
    const { data: projects } = await supabase
        .from('projects')
        .select('*, profiles:client_id(full_name)')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projects</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage and track all client project progress.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href="/admin/projects/new"
                        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                    >
                        <span className="mr-2">+</span> Create New Project
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Project Name
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Client
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Created Date
                                </th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {projects?.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                {project.title.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{project.title}</div>
                                                <div className="text-xs text-gray-400">ID: {project.id.substring(0, 8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600 font-medium">{project.profiles?.full_name || 'Unknown Client'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${project.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                project.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    project.status === 'proposal_ready' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                                            }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${project.status === 'completed' ? 'bg-green-600' :
                                                    project.status === 'in_progress' ? 'bg-blue-600' :
                                                        project.status === 'proposal_ready' ? 'bg-purple-600' :
                                                            'bg-yellow-600'
                                                }`}></span>
                                            {project.status.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(project.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/admin/projects/${project.id}`} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors">
                                            Manage
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {(!projects || projects.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-900 font-medium">No projects found</p>
                                            <p className="text-gray-500 mt-1">Get started by creating a new project.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
