import { createClientUser } from '@/app/(admin)/actions'

export default function NewClientPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-semibold text-gray-900 mb-6">Create New Client</h1>

            <form action={createClientUser} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="full_name"
                            id="full_name"
                            required
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <div className="mt-1">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Temporary Password
                    </label>
                    <div className="mt-1">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            minLength={6}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Client
                    </button>
                </div>
            </form>
        </div>
    )
}
