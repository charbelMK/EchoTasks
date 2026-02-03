'use client'

import React from 'react'

interface Milestone {
    id: string
    title: string
    start_date: string | null
    end_date: string | null
    due_date?: string | null
    created_at?: string
    status: 'pending' | 'in_progress' | 'completed'
}

export default function ProjectGantt({ milestones }: { milestones: Milestone[] }) {
    if (!milestones || milestones.length === 0) return <div className="text-gray-500 text-sm">No timeline data available.</div>

    // Check if any dates exist (start/end OR due_date)
    const hasDates = milestones.some(m => m.start_date || m.end_date || m.due_date)
    if (!hasDates) return <div className="text-gray-500 text-sm p-4 bg-gray-50 rounded">Add dates to milestones to visualize the timeline.</div>

    // Find min and max dates
    const dates = milestones.flatMap(m => [m.start_date, m.end_date, m.due_date, m.created_at].filter(Boolean) as string[]).map(d => new Date(d).getTime())
    const minDate = Math.min(...dates)
    const maxDate = Math.max(...dates)

    const day = 24 * 60 * 60 * 1000
    // buffer
    const startRange = minDate - (day * 5)
    const endRange = maxDate + (day * 5)
    const totalDuration = endRange - startRange

    const getStatusColor = (m: Milestone) => {
        if (m.status === 'completed') return 'bg-emerald-500'

        const end = m.end_date ? new Date(m.end_date).getTime() : 0
        const now = new Date().getTime()
        const isOverdue = end > 0 && now > end

        if (isOverdue) return 'bg-red-500'
        if (m.status === 'in_progress') return 'bg-indigo-600'
        return 'bg-slate-300'
    }

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[600px] relative">
                {/* Header Timeline with Month Markers */}
                <div className="flex border-b border-gray-200 pb-2 mb-4 text-xs text-gray-500">
                    <span>{new Date(startRange).toLocaleDateString()}</span>
                    <div className="flex-1 flex justify-around">
                        {/* Placeholder for intermediate dates if needed, or just spaced out */}
                    </div>
                    <span>{new Date(endRange).toLocaleDateString()}</span>
                </div>

                <div className="space-y-4">
                    {milestones.map(m => {
                        // Fallback logic for basic visualization when explicit Gantt dates are missing
                        const startDateStr = m.start_date || m.created_at || new Date().toISOString()
                        const endDateStr = m.end_date || m.due_date || startDateStr

                        const start = new Date(startDateStr).getTime()
                        let end = new Date(endDateStr).getTime()

                        // Ensure end is at least 1 day after start for visibility
                        if (end <= start) {
                            end = start + (24 * 60 * 60 * 1000)
                        }

                        const left = ((start - startRange) / totalDuration) * 100
                        const width = ((end - start) / totalDuration) * 100
                        const colorClass = getStatusColor(m)

                        return (
                            <div key={m.id} className="relative h-8 flex items-center group">
                                <div className="w-1/4 pr-4 truncate text-sm font-medium text-gray-700">{m.title}</div>
                                <div className="w-3/4 relative h-6 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`absolute h-full rounded-md shadow-sm ${colorClass} opacity-90 hover:opacity-100 transition-all cursor-pointer`}
                                        style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
                                        title={`${m.title}: ${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()} (${m.status})`}
                                    ></div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex gap-4 text-xs text-gray-600 justify-end border-t pt-4">
                    <div className="flex items-center"><span className="w-3 h-3 bg-emerald-500 rounded mr-2"></span> Completed</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-indigo-600 rounded mr-2"></span> In Progress</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-slate-300 rounded mr-2"></span> Pending</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded mr-2"></span> Overdue</div>
                </div>
            </div>
        </div>
    )
}
