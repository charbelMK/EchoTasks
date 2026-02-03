'use client'

import { useActionState } from 'react'
import { submitProjectRequest } from '../../actions'
import { ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'

const initialState = {
    message: null,
}

export default function RequestProjectPage() {
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        try {
            await submitProjectRequest(formData)
            return { message: null }
        } catch (error: any) {
            return { message: error.message }
        }
    }, initialState)

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Start a New Project</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Tell us about your vision. We'll review your request and draft a detailed proposal for you.
                </p>
            </div>

            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    <form action={formAction} className="space-y-6">
                        {state?.message && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Error submitting request</h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{state.message}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

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
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                                    placeholder="e.g. Website Redesign for My Business"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description & Goals
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    required
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                                    placeholder="Describe what you want to build, your target audience, and key features."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700">
                                    Budget Range (Optional)
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="budget_range"
                                        name="budget_range"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                                    >
                                        <option value="">Select a range...</option>
                                        <option value="under_1k">Under $1,000</option>
                                        <option value="1k_5k">$1,000 - $5,000</option>
                                        <option value="5k_10k">$5,000 - $10,000</option>
                                        <option value="10k_plus">$10,000+</option>
                                        <option value="hourly">Hourly / Retainer</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="timeline_preference" className="block text-sm font-medium text-gray-700">
                                    Timeline Preference (Optional)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="timeline_preference"
                                        id="timeline_preference"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                                        placeholder="e.g. ASAP, Within 1 month"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200 flex justify-end">
                            <Link
                                href="/dashboard"
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? 'Submitting...' : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" /> Submit Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
