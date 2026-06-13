import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (isLoading: boolean) => void
  login: (user: User, session: Session) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  login: (user, session) => set({ user, session, isLoading: false }),
  logout: () => set({ user: null, session: null, isLoading: false }),
}))
