'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function AdminSearchBar() {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [isPending, startTransition] = useTransition()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            startTransition(() => {
                router.push(`/admin/search?q=${encodeURIComponent(query)}`)
            })
        }
    }

    return (
        <form onSubmit={handleSearch} className="flex-1 max-w-lg">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 text-slate-400 ${isPending ? 'animate-pulse text-indigo-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-md leading-5 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-slate-700 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder="Search projects, clients..."
                />
            </div>
        </form>
    )
}
