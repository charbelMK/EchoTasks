'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const TIMEOUT_DURATION = 5 * 60 * 1000 // 5 minutes

export default function SessionTimeout() {
    const router = useRouter()
    const supabase = createClient()
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const logout = async () => {
        await supabase.auth.signOut()
        router.push('/login?message=Session expired due to inactivity')
    }

    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(logout, TIMEOUT_DURATION)
    }

    useEffect(() => {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart']

        // Start the timer
        resetTimer()

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer)
        })

        // Cleanup
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
            events.forEach(event => {
                window.removeEventListener(event, resetTimer)
            })
        }
    }, [])

    return null
}
