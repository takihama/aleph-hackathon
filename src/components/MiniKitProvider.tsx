'use client'

import { ReactNode, useEffect, useState } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

export default function MiniKitProvider({ children }: { children: ReactNode }) {
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        try {
            MiniKit.install()
            console.log('MiniKit installed successfully')
            setIsInitialized(true)
        } catch (error) {
            console.error('MiniKit installation error:', error)
        }
    }, [])

    // Add loading state if needed
    if (!isInitialized) {
        return <div>Loading...</div>
    }

    return <>{children}</>
} 