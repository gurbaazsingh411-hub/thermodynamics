// Simple authentication system with optional Supabase integration
import { createClient } from '@supabase/supabase-js'

// Types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Local storage keys
const AUTH_STORAGE_KEY = 'auth-user'
const AUTH_TOKEN_KEY = 'auth-token'

// Supabase configuration (optional)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create Supabase client if configured
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null

// Helper functions
const saveAuthState = (user: User | null) => {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

const loadAuthState = (): User | null => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

// Main auth functions
export const simpleAuth = {
  // Get current auth state
  getCurrentState(): AuthState {
    const user = loadAuthState()
    return {
      user,
      isAuthenticated: !!user,
      isLoading: false
    }
  },

  // Sign up
  async signUp(email: string, password: string, fullName?: string): Promise<{ error?: Error }> {
    try {
      // If Supabase is configured, use it
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        })

        if (error) throw error
        
        if (data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            created_at: data.user.created_at || new Date().toISOString()
          }
          saveAuthState(user)
          return { error: undefined }
        }
      }

      // Fallback to local storage simulation
      const user: User = {
        id: `local-${Date.now()}`,
        email,
        full_name: fullName,
        created_at: new Date().toISOString()
      }
      saveAuthState(user)
      return { error: undefined }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: error as Error }
    }
  },

  // Sign in
  async signIn(email: string, password: string): Promise<{ error?: Error }> {
    try {
      // If Supabase is configured, use it
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error
        
        if (data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: (data.user.user_metadata?.full_name as string) || undefined,
            avatar_url: (data.user.user_metadata?.avatar_url as string) || undefined,
            created_at: data.user.created_at || new Date().toISOString()
          }
          saveAuthState(user)
          return { error: undefined }
        }
      }

      // Fallback to local storage simulation
      // In a real app, you'd validate against a backend
      const user = loadAuthState()
      if (user && user.email === email) {
        saveAuthState(user)
        return { error: undefined }
      }

      // For demo purposes, create a temporary user
      const demoUser: User = {
        id: `demo-${Date.now()}`,
        email,
        full_name: 'Demo User',
        created_at: new Date().toISOString()
      }
      saveAuthState(demoUser)
      return { error: undefined }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: error as Error }
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      if (supabase) {
        await supabase.auth.signOut()
      }
      saveAuthState(null)
    } catch (error) {
      console.error('Sign out error:', error)
      saveAuthState(null) // Still clear local state
    }
  },

  // Load user profile (if using Supabase)
  async loadUserProfile(): Promise<User | null> {
    const currentUser = loadAuthState()
    if (!currentUser || !supabase) return currentUser

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (!error && profile) {
        const updatedUser: User = {
          ...currentUser,
          full_name: profile.full_name || currentUser.full_name,
          avatar_url: profile.avatar_url || currentUser.avatar_url
        }
        saveAuthState(updatedUser)
        return updatedUser
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }

    return currentUser
  }
}