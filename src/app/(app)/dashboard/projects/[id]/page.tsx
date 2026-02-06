import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Calendar, CheckCircle, Clock, FileText, MessageSquare, User } from 'lucide-react'
import ProjectGantt from '@/components/common/ProjectGantt'
import ApproveProposalButton from './ApproveProposalButton'
import CommentSection from '@/components/common/CommentSection'

export default async function ClientProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Fetch Project
    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('client_id', user.id)
        .single()

    if (!project) notFound()

    // Fetch Milestones
    const { data: milestones } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', id)
        .order('due_date', { ascending: true })

    // Fetch Updates
    const { data: updates } = await supabase
        .from('updates')
        .select(`
            *,
            profiles:author_id(full_name),
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
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Proposal Review Section */}
            {(project.status === 'draft' || project.status === 'proposal_ready') && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                {project.status === 'draft' ? 'Proposal in Progress' : 'Proposal Ready for Review'}
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                    {project.status === 'draft'
                                        ? 'We are currently drafting the milestones and details for this project. Please check back soon.'
                                        : 'Please review the project details, milestones, and timeline below. If everything looks good, approve the proposal to get started.'}
                                </p>
                            </div>
                            {project.status === 'proposal_ready' && (
                                <div className="mt-4">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <ApproveProposalButton projectId={id} />
                                        </div>

                                        <details className="group">
                                            <summary className="text-sm text-yellow-800 cursor-pointer hover:underline focus:outline-none">
                                                Request changes instead?
                                            </summary>
                                            <div className="mt-4 max-w-xl">
                                                <form action={async (formData: FormData) => {
                                                    'use server'
                                                    const { submitChangeRequest } = await import('../../../actions')
                                                    const content = formData.get('content') as string
                                                    await submitChangeRequest(id, content)
                                                }}>
                                                    <label htmlFor="changes" className="block text-sm font-medium text-gray-700">Describe desired changes</label>
                                                    <div className="mt-1">
                                                        <textarea
                                                            id="changes"
                                                            name="content"
                                                            rows={3}
                                                            className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                                                            placeholder="e.g. Can we adjust the milestone date for..."
                                                            required
                                                        ></textarea>
                                                    </div>
                                                    <div className="mt-2">
                                                        <button
                                                            type="submit"
                                                            className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            Submit Change Request
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* A. Project Header */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {project.status.replace('_', ' ').toUpperCase()}
                                </span>
                                <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <span>
                                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}
                                    {' '}→{' '}
                                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Ongoing'}
                                </span>
                            </div>
                        </div>
                        {/* Manager Placeholder */}
                        <div className="mt-4 md:mt-0 flex items-center">
                            <div className="flex-shrink-0">
                                <span className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <User className="h-6 w-6" />
                                </span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Project Manager</p>
                                <p className="text-sm text-gray-500">EchoTasks Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-6 bg-gray-50">
                    {(project.status === 'in_progress' || project.status === 'completed') ? (
                        <div>
                            <div className="flex justify-between text-sm font-medium text-gray-900 mb-2">
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-indigo-600'}`}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">{project.description}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-gray-500">{project.description}</p>
                            <p className="mt-2 text-xs text-yellow-600 italic">Progress tracking will begin once the project is approved and active.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* B. Milestones Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-indigo-500" /> Milestones & Timeline
                    </h2>

                    {/* Gantt Chart (Client View) */}
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-4">Project Timeline Visualization</h3>
                        {/* @ts-ignore */}
                        <ProjectGantt milestones={milestones as any[]} />
                    </div>

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {milestones?.map((milestone) => (
                                <li key={milestone.id} className="group">
                                    <details className="group-open:bg-gray-50">
                                        <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 list-none outline-none">
                                            <div className="flex items-center">
                                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-4 ${milestone.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                    {milestone.status === 'completed' ? <CheckCircle className="h-5 w-5" /> : <div className="h-2.5 w-2.5 bg-current rounded-full" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {/* @ts-ignore */}
                                                        {milestone.start_date ? `${new Date(milestone.start_date).toLocaleDateString()} - ` : ''}
                                                        Due: {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : (milestone.end_date ? new Date(milestone.end_date).toLocaleDateString() : 'N/A')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {milestone.status.replace('_', ' ')}
                                                </span>
                                                <svg className="ml-2 h-5 w-5 text-gray-400 transform group-open:rotate-90 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </summary>
                                        <div className="px-6 pb-4 pl-16">
                                            <p className="text-sm text-gray-500">{milestone.description}</p>
                                            {milestone.file_path && (
                                                <div className="mt-2">
                                                    <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project_files/${milestone.file_path}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:text-indigo-900 inline-flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                                        View Attachment
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </details>
                                </li>
                            ))}
                            {(!milestones || milestones.length === 0) && (
                                <li className="px-6 py-8 text-center text-sm text-gray-500">No milestones defined yet.</li>
                            )}
                        </ul>
                    </div>

                    {/* D. Comments / Help */}
                    <div className="space-y-4">
                        <div className="bg-indigo-50 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-indigo-900">Need clarification?</h3>
                                <p className="text-sm text-indigo-700 mt-1">Have a question about this project or a specific milestone?</p>
                            </div>
                            <a
                                href="mailto:info@echotask.co.ke"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Ask a Question
                            </a>
                        </div>

                        {/* Change Request for Active Projects */}
                        {project.status === 'in_progress' && (
                            <details className="bg-white border border-gray-200 rounded-lg p-4">
                                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Request a scope change or revision
                                </summary>
                                <div className="mt-4">
                                    <form action={async (formData: FormData) => {
                                        'use server'
                                        const { submitChangeRequest } = await import('../../../actions')
                                        const content = formData.get('content') as string
                                        await submitChangeRequest(id, content)
                                    }}>
                                        <label htmlFor="active_changes" className="sr-only">Describe change</label>
                                        <textarea
                                            id="active_changes"
                                            name="content"
                                            rows={3}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-900"
                                            placeholder="Describe the change you need..."
                                            required
                                        ></textarea>
                                        <div className="mt-2 flex justify-end">
                                            <button
                                                type="submit"
                                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Submit Request
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </details>
                        )}
                    </div>
                </div>

                {/* C. Milestone Updates */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-indigo-500" /> Latest Updates
                    </h2>
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flow-root">
                            <ul role="list" className="-mb-8">
                                {updates?.map((update, updateIdx) => (
                                    <li key={update.id}>
                                        <div className="relative pb-8">
                                            {updateIdx !== updates.length - 1 ? (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                            ) : null}
                                            <div className="relative flex space-x-3">
                                                <div className="relative">
                                                    <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center ring-4 ring-white">
                                                        <User className="h-4 w-4 text-indigo-600" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 ">
                                                    <div className="text-xs text-gray-500 mb-1">
                                                        <span className="font-medium text-gray-900">{update.profiles?.full_name || 'Admin'}</span>
                                                        <span className="mx-1">&bull;</span>
                                                        {new Date(update.created_at).toLocaleDateString()}
                                                    </div>
                                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                        {update.content}
                                                    </p>
                                                    {/* New Multi-file support */}
                                                    {/* @ts-ignore */}
                                                    {update.file_paths && update.file_paths.length > 0 && (
                                                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {/* @ts-ignore */}
                                                            {update.file_paths.map((path: string, idx: number) => (
                                                                <div key={idx}>
                                                                    {path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                                        <a
                                                                            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project_files/${path}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="block rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity group relative"
                                                                        >
                                                                            <img
                                                                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project_files/${path}`}
                                                                                alt="Update attachment"
                                                                                className="max-w-full h-auto"
                                                                            />
                                                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all opacity-0 group-hover:opacity-100">
                                                                                <span className="bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded shadow">Click to view</span>
                                                                            </div>
                                                                        </a>
                                                                    ) : (
                                                                        <a
                                                                            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project_files/${path}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            download
                                                                            className="flex items-center p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors group"
                                                                        >
                                                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200">
                                                                                <FileText className="h-4 w-4" />
                                                                            </div>
                                                                            <div className="ml-3 flex-1 overflow-hidden">
                                                                                <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate">Download</p>
                                                                                <p className="text-xs text-gray-500 truncate">{path.split('/').pop()}</p>
                                                                            </div>
                                                                            <svg className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Legacy support */}
                                                    {update.file_path && !update.file_paths && (
                                                        <div className="mt-2">
                                                            {/* Check if image for inline display, otherwise link */}
                                                            {update.file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                                <a
                                                                    href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project_files/${update.file_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block mt-2 rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity group relative"
                                                                >
                                                                    <img
                                                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project_files/${update.file_path}`}
                                                                        alt="Update attachment"
                                                                        className="max-w-full h-auto"
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all opacity-0 group-hover:opacity-100">
                                                                        <span className="bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded shadow">Click to view</span>
                                                                    </div>
                                                                </a>
                                                            ) : (
                                                                <a
                                                                    href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project_files/${update.file_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    download
                                                                    className="mt-2 flex items-center p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors group"
                                                                >
                                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200">
                                                                        <FileText className="h-4 w-4" />
                                                                    </div>
                                                                    <div className="ml-3 flex-1">
                                                                        <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">Download Attachment</p>
                                                                        <p className="text-xs text-gray-500 truncate">{update.file_path.split('/').pop()}</p>
                                                                    </div>
                                                                    <svg className="h-5 w-5 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* Mock Photo Grid or handling if 'images' existed would go here */}
                                                    {/* @ts-ignore */}
                                                    <CommentSection updateId={update.id} projectId={id} comments={update.comments || []} />
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                                {(!updates || updates.length === 0) && (
                                    <li className="text-center py-4 text-sm text-gray-500">No updates yet.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
