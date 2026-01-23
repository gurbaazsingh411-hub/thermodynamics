import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { simpleAuth, User } from '@/lib/simpleAuth'
import { useToast } from '@/hooks/use-toast'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
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
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      signIn: async (email, password) => {
        try {
          set({ isLoading: true })
          
          const result = await simpleAuth.signIn(email, password)
          
          if (result.error) {
            return result
          }
          
          const currentState = simpleAuth.getCurrentState()
          set({ 
            user: currentState.user, 
            isAuthenticated: currentState.isAuthenticated,
            isLoading: false
          })
          
          // Load profile if using Supabase
          await get().loadUserProfile()
          
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
          
          const result = await simpleAuth.signUp(email, password, fullName)
          
          if (result.error) {
            return result
          }
          
          const currentState = simpleAuth.getCurrentState()
          set({ 
            user: currentState.user, 
            isAuthenticated: currentState.isAuthenticated,
            isLoading: false
          })
          
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
        
        try {
          await simpleAuth.signOut()
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false 
          })
        } catch (error) {
          console.error('Sign out error:', error)
          // Still clear local state even if Supabase fails
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false 
          })
        }
      },

      loadUserProfile: async () => {
        try {
          const updatedUser = await simpleAuth.loadUserProfile()
          if (updatedUser) {
            set({ user: updatedUser })
          }
        } catch (error) {
          console.error('Error loading user profile:', error)
        }
      },

      initializeAuth: async () => {
        set({ isLoading: true })
        
        try {
          const currentState = simpleAuth.getCurrentState()
          set({ 
            user: currentState.user,
            isAuthenticated: currentState.isAuthenticated,
            isLoading: false
          })
          
          // Load profile if authenticated and using Supabase
          if (currentState.isAuthenticated) {
            await get().loadUserProfile()
          }
        } catch (error) {
          console.error('Error initializing auth:', error)
          set({ isLoading: false })
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
