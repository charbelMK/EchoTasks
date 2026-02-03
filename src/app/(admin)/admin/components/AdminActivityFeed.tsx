import { createClient } from '@/utils/supabase/server'
import { FileText, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default async function AdminActivityFeed() {
    const supabase = await createClient()

    // Fetch latest 5 from each category to mix
    const [
        { data: newRequests },
        { data: newProjects },
        { data: newChanges },
        { data: recentUpdates }
    ] = await Promise.all([
        supabase.from('project_requests').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('projects').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('change_requests').select('*, profiles(full_name), projects(title)').order('created_at', { ascending: false }).limit(5),
        supabase.from('project_updates').select('*, projects(title)').order('created_at', { ascending: false }).limit(5)
    ])

    // Normalize and combine
    const activities = [
        ...(newRequests?.map(r => ({
            type: 'request',
            id: r.id,
            title: 'New Project Request',
            description: `from ${r.profiles?.full_name}`,
            date: new Date(r.created_at),
            link: '/admin/requests',
            icon: FileText,
            color: 'blue'
        })) || []),
        ...(newProjects?.map(p => ({
            type: 'project',
            id: p.id,
            title: 'Project Started',
            description: `${p.title} for ${p.profiles?.full_name}`,
            date: new Date(p.created_at),
            link: '/admin/projects',
            icon: CheckCircle,
            color: 'green'
        })) || []),
        ...(newChanges?.map(c => ({
            type: 'change',
            id: c.id,
            title: 'Change Request',
            description: `on ${c.projects?.title}`,
            date: new Date(c.created_at),
            link: '/admin/changes',
            icon: RefreshCw,
            color: 'orange'
        })) || []),
        ...(recentUpdates?.map(u => ({
            type: 'update',
            id: u.id,
            title: 'Project Update',
            description: `posted on ${u.projects?.title}`,
            date: new Date(u.created_at),
            link: `/admin/projects/${u.project_id}`,
            icon: MessageSquare,
            color: 'purple'
        })) || [])
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10)

    function formatTimeAgo(date: Date) {
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        return `${Math.floor(diffInSeconds / 86400)}d ago`
    }

    return (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 h-96 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            </div>
            <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                <div className="relative">
                    {/* Vertical line connector */}
                    <div className="absolute top-0 bottom-0 left-8 w-px bg-gray-200 z-0"></div>
                    <ul className="py-2">
                        {activities.length > 0 ? (
                            activities.map((activity, idx) => (
                                <li key={`${activity.type}-${activity.id}`} className="relative pl-6 pr-6 py-3 hover:bg-gray-50 transition-colors z-10 w-full group">
                                    <Link href={activity.link} className="flex items-start">
                                        <div className={`h-5 w-5 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 z-10 mt-1 bg-${activity.color}-100`}>
                                            <div className={`h-2 w-2 rounded-full bg-${activity.color}-500`}></div>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm text-gray-800 font-medium group-hover:text-indigo-600 transition-colors">
                                                {activity.title} <span className="font-normal text-gray-500 text-xs ml-1">- {activity.description}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">{formatTimeAgo(activity.date)}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li className="px-6 py-8 text-center text-sm text-gray-500">
                                No recent activity found.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
