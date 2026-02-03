'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function createClientUser(formData: FormData) {
    // 1. Verify standard admin permissions first
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    // Verify role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
        throw new Error('Unauthorized')
    }

    // 2. Use Service Role to create the new user
    const supabaseAdmin = createAdminClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email for simplicity in this phase
        user_metadata: {
            full_name,
            role: 'client' // Ensure metadata has role for initial trigger (optional, depending on trigger logic)
        }
    })

    if (createError) {
        throw new Error(createError.message)
    }

    // Double check profile creation if trigger failed or update specific fields
    // The trigger 'on_auth_user_created' should handle basic profile creation.

    revalidatePath('/admin/clients')
    redirect('/admin/clients')
}

export async function createProject(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const client_id = formData.get('client_id') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') as string

    const { error } = await supabase.from('projects').insert({
        title,
        description,
        client_id,
        start_date: start_date || null,
        end_date: end_date || null,
        status: 'pending'
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/projects')
    redirect('/admin/projects')
}

export async function createMilestone(formData: FormData) {
    const supabase = await createClient()

    const project_id = formData.get('project_id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const due_date = formData.get('due_date') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') as string
    const file = formData.get('file') as File | null

    let file_path = null

    if (file && file.size > 0) {
        const filename = `${project_id}/${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage.from('project_files').upload(filename, file)
        if (uploadError) throw new Error('Upload failed: ' + uploadError.message)
        file_path = filename
    }

    const { error } = await supabase.from('milestones').insert({
        project_id,
        title,
        description,
        due_date: due_date || null,
        start_date: start_date || null,
        end_date: end_date || null,
        file_path, // Save path
        status: 'pending'
    })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath(`/admin/projects/${project_id}`)
}

export async function postUpdate(formData: FormData) {
    const supabase = await createClient()

    const project_id = formData.get('project_id') as string
    const content = formData.get('content') as string
    const milestone_id = formData.get('milestone_id') as string // Get milestone_id
    const files = formData.getAll('file') as File[]
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    let file_paths: string[] = []

    if (files && files.length > 0) {
        for (const file of files) {
            if (file.size > 0) {
                const filename = `${project_id}/updates/${Date.now()}-${file.name}`
                const { error: uploadError } = await supabase.storage.from('project_files').upload(filename, file)
                if (uploadError) throw new Error('Upload failed: ' + uploadError.message)
                file_paths.push(filename)
            }
        }
    }

    // 1. Create Update
    const { error } = await supabase.from('updates').insert({
        project_id,
        author_id: user.id,
        content,
        milestone_id: milestone_id || null, // Insert milestone_id
        file_paths // Store array
    })

    if (error) {
        throw new Error(error.message)
    }

    // 1.5 Update Milestone Status if requested
    const milestone_status = formData.get('milestone_status') as string
    if (milestone_id && milestone_status) {
        const { error: statusError } = await supabase.from('milestones')
            .update({ status: milestone_status })
            .eq('id', milestone_id)

        if (statusError) console.error('Failed to update milestone status:', statusError)
    }

    // 2. Notify Client (Get project client_id first)
    const { data: project } = await supabase.from('projects').select('client_id, title').eq('id', project_id).single()

    if (project) {
        // Don't notify if the author IS the client (rare in admin panel but possible logic check)
        // Assuming admin is posting -> notify client
        if (project.client_id !== user.id) {
            await supabase.from('notifications').insert({
                user_id: project.client_id,
                title: 'New Project Update',
                message: `New update on "${project.title}": ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
                type: 'info',
                link: `/dashboard/projects/${project_id}`
            })
        }
    }

    revalidatePath(`/admin/projects/${project_id}`)
}

export async function convertProjectRequest(requestId: string, formData: FormData) {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Ideally we check role here again or rely on RLS if configured for admin table

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const client_id = formData.get('client_id') as string
    const budget = formData.get('budget') as string

    // 1. Create Project
    const { data: project, error: projectError } = await supabase.from('projects').insert({
        title,
        description,
        client_id,
        status: 'draft' // New status
    }).select().single()

    if (projectError) throw new Error(projectError.message)

    // 2. Update Request Status
    const { error: requestError } = await supabase.from('project_requests').update({
        status: 'converted'
    }).eq('id', requestId)

    if (requestError) {
        // Log error but prioritize project creation? Or rollback? 
        // For now, simple error throw
        console.error('Failed to update request status', requestError)
    }

    revalidatePath('/admin/requests')
    revalidatePath('/admin/projects')
    redirect(`/admin/projects/${project.id}`) // Redirect to new project to add milestones
}

export async function submitProposal(projectId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 1. Update Project Status
    const { data: project, error } = await supabase.from('projects')
        .update({ status: 'proposal_ready' })
        .eq('id', projectId)
        .select('client_id, title')
        .single()

    if (error) throw new Error(error.message)

    // 2. Notify Client
    if (project) {
        await supabase.from('notifications').insert({
            user_id: project.client_id,
            title: 'Proposal Ready for Review',
            message: `The proposal for "${project.title}" is ready. Please review and approve it to get started.`,
            type: 'action_required'
        })
    }

    revalidatePath(`/admin/projects/${projectId}`)
    revalidatePath('/admin')
}

export async function resolveChangeRequest(requestId: string, projectId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('change_requests')
        .update({ status: 'approved' })
        .eq('id', requestId)

    if (error) throw new Error(error.message)

    revalidatePath(`/admin/projects/${projectId}`)
    revalidatePath('/admin/changes')
    revalidatePath('/admin')
}

export async function updateMilestoneStatus(milestoneId: string, projectId: string, newStatus: string) {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('milestones')
        .update({ status: newStatus })
        .eq('id', milestoneId)

    if (error) throw new Error(error.message)

    revalidatePath(`/admin/projects/${projectId}`)
}

export async function updateMilestone(milestoneId: string, projectId: string, data: { title: string; description: string; start_date: string | null; end_date: string | null; due_date: string | null }) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('milestones')
        .update(data)
        .eq('id', milestoneId)

    if (error) throw new Error(error.message)

    revalidatePath(`/admin/projects/${projectId}`)
}
