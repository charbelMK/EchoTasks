import { createClient } from '@/utils/supabase/server'
import { FileText, CheckCircle, Clock, XCircle, ChevronRight, Filter } from 'lucide-react'
import Link from 'next/link'
import { convertProjectRequest } from '../../actions'

export default async function AdminRequestsPage() {
    const supabase = await createClient()

    const { data: requests } = await supabase
        .from('project_requests')
        .select('*, profiles:client_id(full_name, email)')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Project Requests</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Intake queue for new project inquiries. Review and draft proposals.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    >
                        <Filter className="mr-2 h-4 w-4 text-gray-500" />
                        Filter Requests
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Client Details
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Request Overview
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Submission Date
                                </th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests?.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 shadow-sm">
                                                    {request.profiles?.full_name?.[0] || 'C'}
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">{request.profiles?.full_name}</div>
                                                <div className="text-xs text-gray-500">{request.profiles?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col max-w-md">
                                            <span className="text-sm text-gray-900 font-semibold mb-1">{request.title}</span>
                                            <span className="text-sm text-gray-500 line-clamp-1 mb-1">{request.description}</span>
                                            <span className="inline-flex items-center text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md w-fit border border-gray-100">
                                                Budget: {request.budget_range || 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${request.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                request.status === 'converted' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    'bg-gray-50 text-gray-700 border-gray-200'
                                            }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${request.status === 'pending' ? 'bg-yellow-600' :
                                                    request.status === 'converted' ? 'bg-green-600' :
                                                        'bg-gray-600'
                                                }`}></span>
                                            {request.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(request.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {request.status === 'pending' ? (
                                            <div className="flex items-center justify-end space-x-3">
                                                {/* Accept & Draft */}
                                                <form action={convertProjectRequest.bind(null, request.id)}>
                                                    <input type="hidden" name="title" value={request.title} />
                                                    <input type="hidden" name="description" value={request.description} />
                                                    <input type="hidden" name="client_id" value={request.client_id} />
                                                    <input type="hidden" name="budget" value={request.budget_range || ''} />
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        title="Accept & Draft Project"
                                                    >
                                                        <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Draft Proposal
                                                    </button>
                                                </form>
                                                <button className="text-gray-400 hover:text-red-500 transition-colors" title="Reject Request">
                                                    <XCircle className="h-5 w-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <Link href={`/admin/projects`} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors inline-block">
                                                <ChevronRight className="h-5 w-5" />
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {(!requests || requests.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <FileText className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p className="text-gray-900 font-medium">No new requests</p>
                                            <p className="text-gray-500 mt-1">Check back later for new opportunities.</p>
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
