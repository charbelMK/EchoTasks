import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Calendar, ChevronRight } from 'lucide-react'

export default async function AdminTimeline() {
    const supabase = await createClient()

    // Fetch upcoming pending milestones across all projects
    // We get the milestones and the project titles
    const { data: upcomingMilestones } = await supabase
        .from('milestones')
        .select(`
            id,
            title,
            due_date,
            projects (
                id,
                title,
                profiles (full_name)
            )
        `)
        .eq('status', 'pending')
        .order('due_date', { ascending: true })
        .limit(5)

    return (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h2>
                <Link href="/admin/projects" className="text-xs text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100">
                    View All
                </Link>
            </div>
            <div className="p-0 overflow-y-auto flex-1">
                {upcomingMilestones && upcomingMilestones.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {upcomingMilestones.map((milestone) => {
                            const dueDate = new Date(milestone.due_date)
                            const now = new Date()
                            const isOverdue = dueDate < now
                            const isDueSoon = dueDate.getTime() - now.getTime() < 3 * 24 * 60 * 60 * 1000 // 3 days

                            // Handle potential array return from Supabase relations
                            const project = Array.isArray(milestone.projects) ? milestone.projects[0] : milestone.projects
                            const rawProfile = project?.profiles
                            const profile: any = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile

                            return (
                                <Link href={`/admin/projects/${project?.id}`} key={milestone.id} className="block hover:bg-gray-50 transition-colors group">
                                    <div className="px-6 py-4 flex items-center justify-between">
                                        <div className="flex items-center min-w-0 flex-1 mr-4">
                                            <div className={`h-10 w-10 flex-shrink-0 rounded-lg flex items-center justify-center ${isOverdue ? 'bg-red-100 text-red-600' :
                                                isDueSoon ? 'bg-amber-100 text-amber-600' :
                                                    'bg-indigo-100 text-indigo-600'
                                                }`}>
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div className="ml-4 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{milestone.title}</p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {project?.title} • <span className="text-gray-400">{profile?.full_name}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="text-right mr-3">
                                                <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {isOverdue ? 'Overdue' : 'Due date'}
                                                </p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                        <div className="bg-green-50 rounded-full p-3 mb-3">
                            <Calendar className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-900 font-medium">All caught up!</p>
                        <p className="text-xs text-gray-500 mt-1">No pending milestones coming up shortly.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
