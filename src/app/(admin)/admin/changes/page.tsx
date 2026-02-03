import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { RefreshCw, ArrowRight, CheckCircle } from 'lucide-react'

export default async function AdminChangeRequestsPage() {
    const supabase = await createClient()

    // Fetch pending change requests with related project and client info
    const { data: requests } = await supabase
        .from('change_requests')
        .select(`
            *,
            projects:project_id (title),
            profiles:author_id (full_name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Change Requests Inbox</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Review and manage change requests submitted by clients.
                    </p>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Client / Project
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Request Summary
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Date Submitted
                                </th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests?.map((req: any) => (
                                <tr key={req.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200">
                                                    <RefreshCw className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{req.profiles?.full_name}</div>
                                                <Link href={`/admin/projects/${req.project_id}`} className="text-xs text-indigo-600 hover:text-indigo-900 hover:underline">{req.projects?.title}</Link>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 line-clamp-2 max-w-md">{req.content}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(req.created_at).toLocaleDateString()} <span className="text-gray-400 text-xs ml-1">{new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/admin/projects/${req.project_id}`} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors inline-lex items-center">
                                            Review <ArrowRight className="ml-1 h-3 w-3 inline" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {(!requests || requests.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <CheckCircle className="h-10 w-10 text-green-500 mb-3" />
                                            <p className="text-gray-900 font-medium">All caught up!</p>
                                            <p className="text-gray-500 mt-1">No pending change requests.</p>
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
