import { createClient } from '@/utils/supabase/server'
import { createProject } from '@/app/(admin)/actions'

export default async function NewProjectPage() {
    const supabase = await createClient()
    const { data: clients } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'client')
        .order('full_name', { ascending: true })

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-semibold text-gray-900 mb-6">Create New Project</h1>

            <form action={createProject} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Project Title
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
                        Client
                    </label>
                    <div className="mt-1">
                        <select
                            id="client_id"
                            name="client_id"
                            required
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        >
                            <option value="">Select a client</option>
                            {clients?.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.full_name || client.email}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <div className="mt-1">
                            <input
                                type="date"
                                name="start_date"
                                id="start_date"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <div className="mt-1">
                            <input
                                type="date"
                                name="end_date"
                                id="end_date"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Project
                    </button>
                </div>
            </form>
        </div>
    )
}
