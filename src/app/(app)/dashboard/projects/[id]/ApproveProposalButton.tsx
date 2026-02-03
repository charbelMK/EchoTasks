'use client'

import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { approveProposal } from '../../../actions'

export default function ApproveProposalButton({ projectId }: { projectId: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    async function handleApprove() {
        setIsSubmitting(true)
        try {
            // @ts-ignore - Actions are inferred but types can be tricky
            const result = await approveProposal(projectId)

            toast.success('Proposal Approved!', {
                description: 'Project is now active. Time to get to work!',
            })
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isSubmitting ? (
                <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Approving...
                </>
            ) : (
                <>
                    <CheckCircle className="-ml-1 mr-2 h-4 w-4" />
                    Approve Proposal
                </>
            )}
        </button>
    )
}
