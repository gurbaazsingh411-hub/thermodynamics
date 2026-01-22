import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  TestCase, 
  createTestCase, 
  getUserTestCases, 
  updateTestCase, 
  deleteTestCase,
  getTestCaseById
} from '@/lib/supabase'
import { useAuthStore } from './authStore'

interface TestCaseState {
  testCases: TestCase[]
  isLoading: boolean
  error: string | null
  
  // Actions
  loadTestCases: () => Promise<void>
  createTestCase: (testCase: Omit<TestCase, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; error?: string }>
  updateTestCase: (id: string, updates: Partial<Omit<TestCase, 'id' | 'user_id' | 'created_at'>>) => Promise<{ success: boolean; error?: string }>
  deleteTestCase: (id: string) => Promise<{ success: boolean; error?: string }>
  getTestCaseById: (id: string) => Promise<TestCase | null>
  clearError: () => void
}

export const useTestCaseStore = create<TestCaseState>()(
  persist(
    (set, get) => ({
      testCases: [],
      isLoading: false,
      error: null,

      loadTestCases: async () => {
        const { isAuthenticated } = useAuthStore.getState()
        if (!isAuthenticated) {
          set({ testCases: [] })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const { data, error } = await getUserTestCases()
          
          if (error) throw error
          set({ testCases: data || [] })
        } catch (error) {
          console.error('Error loading test cases:', error)
          set({ error: (error as Error).message })
        } finally {
          set({ isLoading: false })
        }
      },

      createTestCase: async (testCaseData) => {
        set({ isLoading: true, error: null })
        
        try {
          const { data, error } = await createTestCase(testCaseData)
          
          if (error) throw error
          if (data) {
            set((state) => ({
              testCases: [data, ...state.testCases]
            }))
          }
          
          return { success: true }
        } catch (error) {
          const errorMessage = (error as Error).message
          set({ error: errorMessage })
          return { success: false, error: errorMessage }
        } finally {
          set({ isLoading: false })
        }
      },

      updateTestCase: async (id, updates) => {
        set({ isLoading: true, error: null })
        
        try {
          const { data, error } = await updateTestCase(id, updates)
          
          if (error) throw error
          if (data) {
            set((state) => ({
              testCases: state.testCases.map(tc => 
                tc.id === id ? { ...tc, ...data } : tc
              )
            }))
          }
          
          return { success: true }
        } catch (error) {
          const errorMessage = (error as Error).message
          set({ error: errorMessage })
          return { success: false, error: errorMessage }
        } finally {
          set({ isLoading: false })
        }
      },

      deleteTestCase: async (id) => {
        set({ isLoading: true, error: null })
        
        try {
          const { error } = await deleteTestCase(id)
          
          if (error) throw error
          
          set((state) => ({
            testCases: state.testCases.filter(tc => tc.id !== id)
          }))
          
          return { success: true }
        } catch (error) {
          const errorMessage = (error as Error).message
          set({ error: errorMessage })
          return { success: false, error: errorMessage }
        } finally {
          set({ isLoading: false })
        }
      },

      getTestCaseById: async (id) => {
        try {
          const { data, error } = await getTestCaseById(id)
          
          if (error) throw error
          return data || null
        } catch (error) {
          console.error('Error getting test case:', error)
          set({ error: (error as Error).message })
          return null
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'testcase-storage',
      partialize: (state) => ({ 
        testCases: state.testCases 
      })
    }
  )
)