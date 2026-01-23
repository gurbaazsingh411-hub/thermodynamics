import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@supabase/supabase-js'
import { supabase, UserProfile, signUp as apiSignUp, signIn as apiSignIn, signOut as apiSignOut, getCurrentUser, getUserProfile } from '@/lib/supabase'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  signIn: (email: string, password: string) => Promise<{ error?: Error }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: Error }>
  signOut: () => Promise<void>
  loadUserProfile: () => Promise<void>
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setProfile: (profile) => set({ profile }),

      setLoading: (isLoading) => set({ isLoading }),

      signIn: async (email, password) => {
        try {
          set({ isLoading: true })
          
          // Check if Supabase is configured
          const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
          const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
          
          if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.warn('Supabase not configured, simulating sign in')
            // Simulate successful sign-in for demo purposes
            set({ 
              user: { id: 'demo-user', email } as User, 
              isAuthenticated: true 
            })
            return { error: undefined }
          }
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })
          
          if (error) throw error
          if (data.user) {
            set({ user: data.user, isAuthenticated: true })
            await get().loadUserProfile()
          }
          
          return { error: undefined }
        } catch (error) {
          console.error('Sign in error:', error)
          return { error: error as Error }
        } finally {
          set({ isLoading: false })
        }
      },

      signUp: async (email, password, fullName) => {
        try {
          set({ isLoading: true })
          
          // Check if Supabase is configured
          const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
          const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
          
          if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.warn('Supabase not configured, simulating sign up')
            // Simulate successful sign-up for demo purposes
            set({ 
              user: { id: 'demo-user', email } as User, 
              isAuthenticated: true 
            })
            return { error: undefined }
          }
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName }
            }
          })
          
          if (error) throw error
          if (data.user) {
            set({ user: data.user, isAuthenticated: true })
          }
          
          return { error: undefined }
        } catch (error) {
          console.error('Sign up error:', error)
          return { error: error as Error }
        } finally {
          set({ isLoading: false })
        }
      },

      signOut: async () => {
        set({ isLoading: true })
        
        // Check if Supabase is configured
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (SUPABASE_URL && SUPABASE_ANON_KEY) {
          await supabase.auth.signOut()
        }
        
        set({ 
          user: null, 
          profile: null, 
          isAuthenticated: false,
          isLoading: false 
        })
      },

      loadUserProfile: async () => {
        if (!get().user) return
        
        try {
          // Check if Supabase is configured
          const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
          const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
          
          if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            // Set a demo profile when Supabase is not configured
            set({ 
              profile: { 
                id: get().user!.id, 
                email: get().user!.email || '', 
                full_name: 'Demo User',
                avatar_url: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } 
            })
            return
          }
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', get().user!.id)
            .single()
          
          if (!error && profile) {
            set({ profile })
          }
        } catch (error) {
          console.error('Error loading user profile:', error)
        }
      },

      initializeAuth: async () => {
        set({ isLoading: true })
        
        try {
          // Check if Supabase is configured
          const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
          const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
          
          if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.warn('Supabase not configured, initializing demo auth state')
            // Initialize with demo state when Supabase is not configured
            set({ 
              isAuthenticated: false,
              isLoading: false
            })
            return
          }
          
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            set({ 
              user: session.user, 
              isAuthenticated: true 
            })
            await get().loadUserProfile()
          }
        } catch (error) {
          console.error('Error initializing auth:', error)
        } finally {
          set({ isLoading: false })
        }
        
        // Listen for auth changes only if Supabase is configured
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (SUPABASE_URL && SUPABASE_ANON_KEY) {
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              set({ 
                user: session.user, 
                isAuthenticated: true 
              })
              await get().loadUserProfile()
            } else if (event === 'SIGNED_OUT') {
              set({ 
                user: null, 
                profile: null, 
                isAuthenticated: false 
              })
            }
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);