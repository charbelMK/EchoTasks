import { createClient } from '@/utils/supabase/server'
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export default async function NotificationsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // Mock "unread" logic (e.g., created in the last 24 hours) as we don't have a 'read' column yet
    const isUnread = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 1
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {notifications?.length || 0} Total
                </span>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {notifications?.map((notification) => {
                        const unread = isUnread(notification.created_at)
                        return (
                            <li key={notification.id} className={`hover:bg-gray-50 transition duration-150 ease-in-out ${unread ? 'bg-indigo-50/30' : ''}`}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 pt-0.5">
                                            {/* Icon based on type if we had type, otherwise default Bell */}
                                            <div className={`rounded-full p-2 ${unread ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                                                <Bell className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1 ml-4">
                                            <div className="flex items-center justify-between">
                                                <p className={`text-sm font-medium truncate ${unread ? 'text-indigo-600 font-semibold' : 'text-gray-900'}`}>
                                                    {notification.title}
                                                </p>
                                                <div className="ml-2 flex-shrink-0 flex items-center gap-2">
                                                    {unread && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                            New
                                                        </span>
                                                    )}
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(notification.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-1">
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                    {(!notifications || notifications.length === 0) && (
                        <li className="px-4 py-12 text-center text-gray-500">
                            <Bell className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                            <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}
