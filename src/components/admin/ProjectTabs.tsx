'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ProjectTabs({
    overview,
    milestones,
    updates,
    files
}: {
    overview: React.ReactNode
    milestones: React.ReactNode
    updates: React.ReactNode
    files: React.ReactNode
}) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Default to 'overview', but prefer URL param 'tab'
    const tabParam = searchParams.get('tab')
    const [currentTab, setCurrentTab] = useState(tabParam || 'overview')

    // Sync state with URL when URL changes explicitly (e.g. back button or link click)
    useEffect(() => {
        if (tabParam) {
            setCurrentTab(tabParam)
        }
    }, [tabParam])

    const handleTabChange = (tabId: string) => {
        setCurrentTab(tabId)
        // Update URL without full refresh if possible, or just push
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', tabId)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const tabs = [
        { id: 'overview', name: 'Overview' },
        { id: 'milestones', name: 'Milestones' },
        { id: 'updates', name: 'Updates' },
        { id: 'files', name: 'Files' },
    ]

    return (
        <div>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => handleTabChange(tab.id)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                ${currentTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-6">
                <div className={currentTab === 'overview' ? 'block' : 'hidden'}>{overview}</div>
                <div className={currentTab === 'milestones' ? 'block' : 'hidden'}>{milestones}</div>
                <div className={currentTab === 'updates' ? 'block' : 'hidden'}>{updates}</div>
                <div className={currentTab === 'files' ? 'block' : 'hidden'}>{files}</div>
            </div>
        </div>
    )
}
