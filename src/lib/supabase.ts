import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase configuration missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
}

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Types for our database tables
export interface TestCase {
  id: string
  user_id: string
  name: string
  description: string
  cycle_type: 'otto' | 'diesel' | 'rankine' | 'brayton' | 'carnot' | 'refrigeration'
  fluid_properties: {
    name: string
    R: number
    gamma: number
    cp: number
    cv: number
  }
  parameters: {
    T1: number
    P1: number
    compressionRatio: number
    heatAddition: number
    pressureRatio: number
    T3: number
    cutoffRatio: number
  }
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Auth functions
export async function signUp(email: string, password: string, fullName?: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })
  
  return { data, error }
}

export async function signIn(email: string, password: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  return { data, error }
}

export async function signOut() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase is not configured, skipping sign out')
    return { error: null }
  }
  
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null
  }
  
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Test case functions
export async function createTestCase(testCase: Omit<TestCase, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
  }
  
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('test_cases')
    .insert([
      {
        ...testCase,
        user_id: user.id
      }
    ])
    .select()
    .single()

  return { data, error }
}

export async function getUserTestCases() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { data: [], error: null }
  }
  
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('test_cases')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getTestCaseById(id: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { data: null, error: null }
  }
  
  const { data, error } = await supabase
    .from('test_cases')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}

export async function updateTestCase(id: string, updates: Partial<Omit<TestCase, 'id' | 'user_id' | 'created_at'>>) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { data: null, error: null }
  }
  
  const { data, error } = await supabase
    .from('test_cases')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export async function deleteTestCase(id: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: null }
  }
  
  const { error } = await supabase
    .from('test_cases')
    .delete()
    .eq('id', id)

  return { error }
}

// Profile functions
export async function getUserProfile() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { data: null, error: null }
  }
  
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { data, error }
}

export async function updateUserProfile(updates: Partial<UserProfile>) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { data: null, error: null }
  }
  
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  return { data, error }
}