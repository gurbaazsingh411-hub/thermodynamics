import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import Index from './Index'

const Demo = () => {
  const { initializeAuth } = useAuthStore()
  const initializedRef = useRef(false)
  
  useEffect(() => {
    // Initialize auth in demo mode, but only once
    if (!initializedRef.current) {
      initializeAuth()
      initializedRef.current = true
    }
  }, [])
  
  return <Index />
}

export default Demo