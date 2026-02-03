'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function submitProjectRequest(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const budget_range = formData.get('budget_range') as string
    const timeline_preference = formData.get('timeline_preference') as string

    const { error } = await supabase.from('project_requests').insert({
        client_id: user.id,
        title,
        description,
        budget_range: budget_range || null,
        timeline_preference: timeline_preference || null,
        status: 'pending'
    })

    if (error) {
        throw new Error(error.message)
    }

    // Create Notification
    await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Project Request Received',
        message: `We've received your request for "${title}". Our team will review it and draft a proposal soon.`,
        type: 'info'
    })

    revalidatePath('/dashboard')
    redirect('/dashboard?request_success=true')
}

export async function approveProposal(projectId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    console.log('--- APPROVING PROPOSAL ---')
    console.log('Project ID:', projectId)
    console.log('User ID:', user.id)

    // Verify ownership
    const { data: project } = await supabase.from('projects').select('client_id, status').eq('id', projectId).single()
    console.log('Current Project Status:', project?.status)

    if (project?.client_id !== user.id) throw new Error('Unauthorized')

    const { error, data } = await supabase.from('projects').update({
        status: 'in_progress',
        start_date: new Date().toISOString()
    }).eq('id', projectId).select()

    if (error) {
        console.error('Update Error:', error)
        throw new Error(error.message)
    }

    console.log('Update Success. New Data:', data)

    revalidatePath(`/dashboard/projects/${projectId}`)
    revalidatePath('/dashboard')
    return { success: true }
    return { success: true }
}

export async function submitChangeRequest(projectId: string, content: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Verify ownership via RLS or explicit check
    // Inserting into change_requests will fail if RLS policies prevent it, but we can check project first

    const { error } = await supabase.from('change_requests').insert({
        project_id: projectId,
        author_id: user.id,
        content,
        status: 'pending'
    })

    if (error) throw new Error(error.message)

    revalidatePath(`/dashboard/projects/${projectId}`)
}


export async function postComment(updateId: string, projectId: string, content: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('comments').insert({
        update_id: updateId,
        author_id: user.id,
        content
    })

    if (error) {
        console.error('Comment Error:', error)
        throw new Error(error.message)
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
}
