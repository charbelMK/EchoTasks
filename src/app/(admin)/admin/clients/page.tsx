import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function ClientsPage() {
    const supabase = await createClient()
    const { data: clients } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Clients</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your client relationships and contact details.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href="/admin/clients/new"
                        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                    >
                        <span className="mr-2">+</span> Add New Client
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Client Name
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Contact Info
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Joined Date
                                </th>
                                <th scope="col" className="relative px-6 py-4">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {clients?.map((person) => (
                                <tr key={person.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-100">
                                                {person.full_name?.[0] || 'C'}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{person.full_name || 'No Name'}</div>
                                                <div className="text-xs text-gray-400">ID: {person.id.substring(0, 8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-900">{person.email}</span>
                                            <span className="text-xs text-gray-500">{person.phone || 'No phone'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(person.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition-colors">
                                            Edit Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(!clients || clients.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-900 font-medium">No clients found</p>
                                            <p className="text-gray-500 mt-1">Add a new client to get started.</p>
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
