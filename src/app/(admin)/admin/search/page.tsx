import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Folder, Users, Search } from 'lucide-react'

export default async function AdminSearchPage({
    searchParams,
}: {
    searchParams: { q: string }
}) {
    const query = searchParams.q || ''
    const supabase = await createClient()

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <Search className="h-12 w-12 mb-4 text-gray-300" />
                <p>Enter a keyword to search projects and clients.</p>
            </div>
        )
    }

    // Perform parallel search across Projects and Profiles (Clients)
    const [
        { data: projects },
        { data: clients }
    ] = await Promise.all([
        supabase
            .from('projects')
            .select('*, profiles!inner(full_name)')
            .ilike('title', `%${query}%`)
            .limit(10),
        supabase
            .from('profiles')
            .select('*')
            .eq('role', 'client')
            .ilike('full_name', `%${query}%`)
            .limit(10)
    ])

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    Search Results for <span className="text-indigo-600">"{query}"</span>
                </h1>
            </div>

            {/* Projects Results */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
                    <Folder className="h-4 w-4" />
                    <span>Projects ({projects?.length || 0})</span>
                </div>
                {projects && projects.length > 0 ? (
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                        {projects.map((project) => (
                            <Link href={`/admin/projects/${project.id}`} key={project.id} className="block hover:bg-gray-50 transition-colors">
                                <div className="px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                                            {project.title.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">{project.title}</p>
                                            <p className="text-sm text-gray-500">{project.profiles?.full_name}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                                                project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic pl-2">No projects found matching "{query}".</p>
                )}
            </div>

            {/* Clients Results */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
                    <Users className="h-4 w-4" />
                    <span>Clients ({clients?.length || 0})</span>
                </div>
                {clients && clients.length > 0 ? (
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                        {clients.map((client) => (
                            <div key={client.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {client.full_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">{client.full_name}</p>
                                        <p className="text-sm text-gray-500">{client.email}</p>
                                    </div>
                                </div>
                                <a href={`mailto:${client.email}`} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-3 py-1.5 rounded-md">
                                    Contact
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic pl-2">No clients found matching "{query}".</p>
                )}
            </div>
        </div>
    )
}
