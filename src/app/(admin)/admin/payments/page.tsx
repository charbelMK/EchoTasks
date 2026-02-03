export default function PaymentsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payments</h1>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-amber-800 font-medium">
                        Feature Coming Soon
                    </p>
                    <p className="mt-1 text-sm text-amber-700">
                        Payment automation is coming in Phase 2. Currently, please track payments manually or via external systems (M-Pesa/Bank) and record them here.
                    </p>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-medium text-gray-900">Payment Records</h3>
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                        + Record Payment
                    </button>
                </div>
                <div className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-900 font-medium">No payments recorded yet.</p>
                        <p className="text-gray-500 mt-1">Transactions will appear here once recorded.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
