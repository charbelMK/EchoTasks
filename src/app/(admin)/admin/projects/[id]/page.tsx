import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { createMilestone, postUpdate, resolveChangeRequest } from '@/app/(admin)/actions'
import ProjectTabs from '@/components/admin/ProjectTabs'
import ProjectGantt from '@/components/common/ProjectGantt'
import CommentSection from '@/components/common/CommentSection'
import MilestoneManager from '@/components/admin/MilestoneManager'

import Link from 'next/link'

export default async function ProjectDetailPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { id } = await params
    const sp = await searchParams
    const initialMilestoneId = sp.milestoneId as string | undefined
    const supabase = await createClient()

    // Fetch Project
    const { data: project } = await supabase
        .from('projects')
        .select('*, profiles:client_id(full_name)')
        .eq('id', id)
        .single()

    if (!project) notFound()

    // Fetch Milestones
    const { data: milestones } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', id)
        .order('due_date', { ascending: true })

    // Fetch Change Requests
    const { data: changeRequests } = await supabase
        .from('change_requests')
        .select('*, profiles:author_id(full_name)')
        .eq('project_id', id)
        .order('created_at', { ascending: false })

    // Fetch Updates (including author and tied milestone)
    const { data: updates } = await supabase
        .from('updates')
        .select(`
            *,
            profiles:author_id(full_name),
            milestones(title),
            comments(
                id,
                content,
                created_at,
                author_id,
                profiles:author_id(full_name)
            )
        `)
        .eq('project_id', id)
        .order('created_at', { ascending: false })

    // Calculate Progress
    const totalMilestones = milestones?.length || 0
    const completedMilestones = milestones?.filter(m => m.status === 'completed').length || 0
    const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

    // If DRAFT, show Draft Builder
    if (project.status === 'draft') {
        const { data: updates } = await supabase
            .from('updates')
            .select('*, profiles:author_id(full_name), milestones(title)')
            .eq('project_id', id)
            .order('created_at', { ascending: false })

        return (
            <div className="space-y-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            Drafting Proposal: {project.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Build the milestones and timeline for {project.profiles?.full_name}. Client cannot see this yet.
                        </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <form action={async () => {
                            'use server'
                            const { submitProposal } = await import('../../../actions')
                            await submitProposal(id)
                        }}>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Submit Proposal to Client
                            </button>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* A. Project Details Input (Simplified View for now, assumes already set or can edits be added?) */}
                    {/* We can reuse the header but maybe editable forms in future. For now, just display info */}
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Project Overview</h3>
                            {/* In a real app, these would be inputs */}
                            <dl className="mt-5 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{project.description}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Budget Range</dt>
                                    {/* Need to fetch from Project Request or store in Project? Currently just in Project Request. */}
                                    <dd className="mt-1 text-sm text-gray-900">N/A (See Request)</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* B. Milestones Builder */}
                    <div className="space-y-6">
                        <div className="bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Milestones Builder</h3>
                                <p className="mt-1 text-sm text-gray-500">Define the key steps and dates.</p>

                                <div className="mt-6 border-b border-gray-200 pb-6">
                                    <form action={createMilestone} className="space-y-4">
                                        <input type="hidden" name="project_id" value={project.id} />
                                        <div>
                                            <label htmlFor="draft_milestone_title" className="block text-sm font-medium text-gray-700">Milestone Title</label>
                                            <input type="text" name="title" id="draft_milestone_title" className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900" placeholder="e.g. Design Phase 1" required />
                                        </div>
                                        <div>
                                            <label htmlFor="draft_milestone_desc" className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea name="description" id="draft_milestone_desc" rows={2} className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900" placeholder="Deliverables..." required></textarea>
                                        </div>
                                        <div>
                                            <label htmlFor="draft_milestone_date" className="block text-sm font-medium text-gray-700">Due Date</label>
                                            <input type="date" name="due_date" id="draft_milestone_date" className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900" />
                                        </div>
                                        <div className="flex justify-end">
                                            <button type="submit" className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                                Add Milestone
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Planned Milestones</h4>
                                    <ul className="divide-y divide-gray-200 border-t border-gray-200">
                                        {milestones?.map(milestone => (
                                            <li key={milestone.id} className="py-3 flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                                                    <p className="text-xs text-gray-500">{milestone.description}</p>
                                                </div>
                                                <span className="text-sm text-gray-500">{milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : 'No date'}</span>
                                            </li>
                                        ))}
                                        {(!milestones || milestones.length === 0) && (
                                            <li className="py-3 text-sm text-gray-500 italic">No milestones added yet.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ACTIVE PROJECT VIEW (Tabbed)
    return (
        <div className="space-y-6">
            {/* Header */}
            {/* Header */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-6 sm:p-8">
                    <div className="md:flex md:items-start md:justify-between md:space-x-5">
                        <div className="flex items-start space-x-5">
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                                        <span className="text-2xl font-bold text-white">{project.title.substring(0, 2).toUpperCase()}</span>
                                    </div>
                                    <span className="absolute inset-0 shadow-inner rounded-xl" aria-hidden="true" />
                                </div>
                            </div>
                            <div className="pt-1.5">
                                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                                <p className="text-sm font-medium text-gray-500">
                                    Client: <span className="text-gray-900">{project.profiles?.full_name}</span>
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${project.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                project.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    project.status === 'proposal_ready' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}>
                                <span className={`h-2 w-2 rounded-full mr-2 ${project.status === 'completed' ? 'bg-green-600' :
                                    project.status === 'in_progress' ? 'bg-blue-600' :
                                        project.status === 'proposal_ready' ? 'bg-purple-600' :
                                            'bg-yellow-600'
                                    }`}></span>
                                {project.status.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 border-t border-gray-100 pt-6">
                        <h4 className="text-sm font-medium text-gray-900">Description</h4>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-4xl">{project.description}</p>
                    </div>
                </div>
            </div>

            {/* Change Requests Alert */}
            {changeRequests && changeRequests.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {/* Icon */}
                            <svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3 w-full">
                            <h3 className="text-sm font-medium text-amber-800">
                                Change Requests ({changeRequests.filter(r => r.status === 'pending').length} pending)
                            </h3>
                            <div className="mt-2 text-sm text-amber-700">
                                <ul className="space-y-2">
                                    {changeRequests.map((req) => (
                                        <li key={req.id} className="bg-white/60 rounded-lg p-3 border border-amber-100 flex justify-between items-start">
                                            <div>
                                                <span className="font-semibold block text-amber-900">{req.profiles?.full_name}</span>
                                                <span className="block mt-1">{req.content}</span>
                                                <span className="text-xs text-amber-600/80 mt-1 block">Requested on {new Date(req.created_at).toLocaleDateString()}</span>
                                            </div>
                                            {req.status === 'pending' && (
                                                <form action={async () => {
                                                    'use server'
                                                    await resolveChangeRequest(req.id, id)
                                                }}>
                                                    <button type="submit" className="ml-4 text-xs font-medium text-indigo-600 bg-white border border-indigo-100 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition-colors shadow-sm">
                                                        Mark Resolved
                                                    </button>
                                                </form>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Gantt Chart Visualization */}
            <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6 mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Timeline Visualization</h3>
                {/* @ts-ignore */}
                <ProjectGantt milestones={milestones as any[]} />
            </div>

            <ProjectTabs
                overview={
                    <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Project Overview</h3>
                        <p className="text-sm text-gray-500 mt-2">Brief summary of the project status and key metrics.</p>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-900">Overall Progress</h4>
                            <div className="mt-2 relative">
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                    <div style={{ width: `${progressPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                                </div>
                                <div className="mt-1 flex justify-between text-xs text-gray-600">
                                    <span>{progressPercentage}% Completed</span>
                                    <span>{completedMilestones} / {totalMilestones} Milestones</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Milestones</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{milestones?.length || 0}</dd>
                            </div>
                            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Updates Posted</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{updates?.length || 0}</dd>
                            </div>
                        </div>
                    </div>
                }
                milestones={
                    <MilestoneManager
                        // @ts-ignore
                        initialMilestones={milestones || []}
                        projectId={project.id}
                        gantt={
                            <div className="mb-8 border-b border-gray-200 pb-8">
                                {/* @ts-ignore */}
                                <ProjectGantt milestones={milestones as any[]} />
                            </div>
                        }
                        addForm={
                            <div className="mt-6 border-t pt-6">
                                <h4 className="text-sm font-medium text-gray-900 mb-4">Add Milestone</h4>
                                <form action={createMilestone} className="space-y-4">
                                    <input type="hidden" name="project_id" value={project.id} />
                                    <div>
                                        <label htmlFor="milestone_title" className="sr-only">Title</label>
                                        <input type="text" name="title" id="milestone_title" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900" placeholder="Milestone Title" required />
                                    </div>
                                    <div>
                                        <label htmlFor="milestone_desc" className="sr-only">Description</label>
                                        <input type="text" name="description" id="milestone_desc" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900" placeholder="Description" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="start_date" className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                                            <input type="date" name="start_date" id="start_date" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900" required />
                                        </div>
                                        <div>
                                            <label htmlFor="end_date" className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                                            <input type="date" name="end_date" id="end_date" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900" required />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-center pt-2">
                                        <input type="file" name="file" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                        <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-auto">
                                            Add Milestone
                                        </button>
                                    </div>
                                </form>
                            </div>
                        }
                    />
                }
                updates={
                    <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Project Updates</h3>
                        <div className="mt-4 mb-6">
                            <form action={postUpdate}>
                                <input type="hidden" name="project_id" value={project.id} />
                                <div>
                                    <label htmlFor="update_content" className="sr-only">Update Content</label>
                                    <textarea name="content" id="update_content" rows={3} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900" placeholder="What's the latest progress?" required></textarea>
                                </div>
                                <div className="mt-4 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="milestone_id" className="block text-sm font-medium text-gray-700">Related Milestone</label>
                                        <select
                                            name="milestone_id"
                                            id="milestone_id"
                                            defaultValue={initialMilestoneId || ''}
                                            className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                                        >
                                            <option value="">Select Related Milestone (Optional)</option>
                                            {milestones?.map(m => (
                                                <option key={m.id} value={m.id}>{m.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="milestone_status" className="block text-sm font-medium text-gray-700">Update Status (Optional)</label>
                                        <select
                                            name="milestone_status"
                                            id="milestone_status"
                                            className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                                        >
                                            <option value="">Keep Current Status</option>
                                            <option value="pending">Mark as Pending</option>
                                            <option value="in_progress">Mark as In Progress</option>
                                            <option value="completed">Mark as Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-between items-center border-t pt-4">
                                    <input type="file" name="file" multiple className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                    <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Post Update
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="flow-root">
                            <ul role="list" className="-mb-8">
                                {updates?.map((update, updateIdx) => (
                                    <li key={update.id}>
                                        <div className="relative pb-8">
                                            {updateIdx !== updates.length - 1 ? (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                            ) : null}
                                            <div className="relative flex space-x-3">
                                                <div className="relative px-1">
                                                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center ring-8 ring-white">
                                                        <span className="text-xs font-medium leading-none text-gray-500">
                                                            {update.profiles?.full_name?.[0] || 'U'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {update.profiles?.full_name}
                                                            </p>
                                                            {/* @ts-ignore - Supabase type needs update, manual ignoring for now as join exists */}
                                                            {update.milestones && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                                    {/* @ts-ignore */}
                                                                    {update.milestones.title}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {update.content}
                                                        </p>
                                                        {update.file_paths && update.file_paths.length > 0 && (
                                                            <div className="mt-2 flex flex-wrap gap-2">
                                                                {/* @ts-ignore */}
                                                                {update.file_paths.map((path: string, idx: number) => (
                                                                    <a key={idx} href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project_files/${path}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:text-indigo-900 border border-indigo-100 bg-indigo-50 rounded px-2 py-1 inline-flex items-center">
                                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                                                        {path.split('/').pop()}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {/* Legacy support for single file_path */}
                                                        {update.file_path && !update.file_paths && (
                                                            <div className="mt-2">
                                                                <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project_files/${update.file_path}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:text-indigo-900 border border-indigo-100 bg-indigo-50 rounded px-2 py-1 inline-flex items-center">
                                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                                                    Attachment
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* @ts-ignore */}
                                                    <CommentSection
                                                        updateId={update.id}
                                                        projectId={id}
                                                        comments={update.comments ? [...update.comments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : []}
                                                        readOnly={true}
                                                    />
                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                        <time dateTime={update.created_at}>{new Date(update.created_at).toLocaleDateString()}</time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                }
                files={
                    <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Project Files</h3>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            {/* Combine milestones files and update files */}
                            {(() => {
                                const allFiles: { path: string, title: string, date: string }[] = [];

                                // Milestones
                                milestones?.forEach(m => {
                                    if (m.file_path) allFiles.push({ path: m.file_path, title: `Milestone: ${m.title}`, date: m.due_date || '' });
                                });

                                // Updates
                                updates?.forEach(u => {
                                    // New array paths
                                    // @ts-ignore
                                    if (u.file_paths && u.file_paths.length > 0) {
                                        // @ts-ignore
                                        u.file_paths.forEach(p => {
                                            allFiles.push({ path: p, title: `Update: ${new Date(u.created_at).toLocaleDateString()}`, date: u.created_at });
                                        });
                                    }
                                    // Legacy single path
                                    else if (u.file_path) {
                                        allFiles.push({ path: u.file_path, title: `Update: ${new Date(u.created_at).toLocaleDateString()}`, date: u.created_at });
                                    }
                                });

                                if (allFiles.length === 0) return <p className="col-span-full text-center text-gray-500 py-8">No files uploaded yet.</p>

                                return allFiles.map((item, idx) => (
                                    <div key={idx} className="relative group bg-white p-4 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                        <div className="flex-1 min-w-0">
                                            <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project_files/${item.path}`} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                                                <span className="absolute inset-0" aria-hidden="true" />
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {item.path.split('/').pop()}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {item.title}
                                                </p>
                                            </a>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                }
            />
        </div>
    )
}
