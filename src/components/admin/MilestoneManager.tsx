'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updateMilestone } from '@/app/(admin)/actions'
import { toast } from 'sonner'

interface Milestone {
    id: string
    title: string
    description: string
    start_date: string | null
    end_date: string | null
    due_date: string | null
    file_path: string | null
    status: string
}

interface MilestoneManagerProps {
    initialMilestones: Milestone[]
    projectId: string
    gantt?: React.ReactNode
    addForm?: React.ReactNode
}

export default function MilestoneManager({ initialMilestones, projectId, gantt, addForm }: MilestoneManagerProps) {
    const [milestones, setMilestones] = useState(initialMilestones)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel changes
            setMilestones(initialMilestones)
        }
        setIsEditing(!isEditing)
    }

    const handleChange = (index: number, field: keyof Milestone, value: string) => {
        const newMilestones = [...milestones]
        newMilestones[index] = { ...newMilestones[index], [field]: value }
        setMilestones(newMilestones)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Update all modified milestones
            // In a real app we might only update changed ones, but sorting/diffing is complex. 
            // We'll update all for simplicity or just loop.
            await Promise.all(milestones.map(m =>
                updateMilestone(m.id, projectId, {
                    title: m.title,
                    description: m.description,
                    start_date: m.start_date,
                    end_date: m.end_date,
                    due_date: m.due_date
                })
            ))
            toast.success('Timeline updated')
            setIsEditing(false)
            // Router refresh usually handled by action revalidatePath, 
            // but we might need to update local initialMilestones to avoid reversion on cancel
            // However, the page will reload/refresh from server data.
        } catch (error) {
            console.error(error)
            toast.error('Failed to update timeline')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Milestones</h3>
                <button
                    onClick={handleEditToggle}
                    className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                >
                    {isEditing ? 'Cancel Editing' : 'Edit Timeline'}
                </button>
            </div>

            {/* Visualize Gantt Chart would go here, preserved from parent if moved inside or kept outside */}
            {/* For now, we are replacing the LIST part. The Gantt chart in parent might need to be inside here or refresh automatically via page reload */}

            <ul role="list" className="divide-y divide-gray-200">
                {milestones.map((milestone, index) => (
                    <li key={milestone.id} className="py-4">
                        {isEditing ? (
                            <div className="space-y-3 bg-gray-50 p-4 rounded-md border border-gray-200">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            value={milestone.title}
                                            onChange={(e) => handleChange(index, 'title', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Description</label>
                                        <input
                                            type="text"
                                            value={milestone.description}
                                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Start Date</label>
                                        <input
                                            type="date"
                                            value={milestone.start_date?.split('T')[0] || ''}
                                            onChange={(e) => handleChange(index, 'start_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Due Date</label>
                                        <input
                                            type="date"
                                            value={milestone.due_date?.split('T')[0] || ''}
                                            onChange={(e) => handleChange(index, 'due_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex space-x-3">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium">{milestone.title}</h3>
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={`?tab=updates&milestoneId=${milestone.id}`}
                                                className="inline-flex items-center px-3 py-1.5 border border-indigo-300 text-xs font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                                            >
                                                Post Update & Change Status
                                            </Link>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">{milestone.description}</p>
                                    <p className="text-xs text-gray-400">Due: {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : 'N/A'}</p>
                                    {milestone.file_path && (
                                        <div className="mt-1">
                                            <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project_files/${milestone.file_path}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:text-indigo-900 flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                                View Attachment
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {isEditing && (
                <div className="mt-4 flex justify-end space-x-3 border-t pt-4">
                    <button
                        onClick={handleEditToggle}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}

            {!isEditing && addForm && (
                <div className="mt-6 border-t pt-6">
                    {addForm}
                </div>
            )}
        </div>
    )
}
