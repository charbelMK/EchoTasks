'use client'

import { useState, useTransition } from 'react'
import { postComment } from '@/app/(app)/actions'
import { User, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Comment {
    id: string
    content: string
    created_at: string
    profiles: {
        full_name: string | null
    } | null
}

interface CommentSectionProps {
    updateId: string
    projectId: string
    comments: Comment[]
    readOnly?: boolean
}

export default function CommentSection({ updateId, projectId, comments, readOnly = false }: CommentSectionProps) {
    const [content, setContent] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        startTransition(async () => {
            try {
                // @ts-ignore
                await postComment(updateId, projectId, content)
                setContent('')
                // router.refresh() // revalidatePath in action handles this on server.
                toast.success('Reply posted')
            } catch (error) {
                toast.error('Failed to post reply')
            }
        })
    }

    return (
        <div className="mt-4 border-t border-gray-100 pt-4">
            {/* Existing Comments */}
            {comments.length > 0 && (
                <div className="space-y-4 mb-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                            <div className="flex-shrink-0">
                                <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-500">
                                        {comment.profiles?.full_name?.[0] || 'U'}
                                    </span>
                                </div>
                            </div>
                            <div className="min-w-0 flex-1 bg-gray-50 rounded-lg px-3 py-2">
                                <div className="text-xs font-medium text-gray-900">
                                    {comment.profiles?.full_name || 'User'}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {comment.content}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Input - Hidden if readOnly */}
            {!readOnly && (
                <form onSubmit={handleSubmit} className="flex items-start space-x-3">
                    <div className="min-w-0 flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={isPending}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                                placeholder="Write a reply..."
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isPending || !content.trim()}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isPending ? '...' : <Send className="h-4 w-4" />}
                    </button>
                </form>
            )}
        </div>
    )
}
