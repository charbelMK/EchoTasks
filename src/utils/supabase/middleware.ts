import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // ROUTE PROTECTION LOGIC
    const path = request.nextUrl.pathname

    // Redirect unauthenticated users trying to access protected routes
    if (
        !user &&
        (path.startsWith('/dashboard') || path.startsWith('/admin'))
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Optional: Redirect authenticated users away from auth pages (login/signup)
    if (user && path.startsWith('/login')) {
        // Check role to decide where to go? For now default to dashboard
        // We can refetch profile to check role if needed, but keeping it simple for now.
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return response
}
