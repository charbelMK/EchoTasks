import { createClient } from '@supabase/supabase-js'

// Note: This client should ONLY be used in Server Actions or API routes.
// NEVER use this in Client Components.
export function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
}
