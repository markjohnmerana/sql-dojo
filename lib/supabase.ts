import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Todo = {
  id: string
  text: string
  completed: boolean
  created_at: string
  date: string
  user_id: string
}

export type ProblemAttempt = {
  id: string
  problem_id: number
  date: string
  completed: boolean
  notes: string
  created_at: string
  user_id: string
}

export type AuthUser = {
  id: string
  email?: string
}
