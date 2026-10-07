import * as React from 'react'
import { supabase } from '@/integrations/supabase/client'

type SessionUser = { id: string; email?: string | null } & Record<string, unknown>

type AuthState = {
  user: SessionUser | null
  isAdmin: boolean
  loading: boolean
}

export function useAuth() {
  const [state, setState] = React.useState<AuthState>({ user: null, isAdmin: false, loading: true })

  const checkAdmin = React.useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' })
      if (error) {
        console.error('[useAuth] has_role error:', error)
        return false
      }
      return !!data
    } catch {
      return false
    }
  }, [])

  const refreshSession = React.useCallback(async () => {
    const auth = supabase.auth as unknown as {
      getSession: () => Promise<{ data: { session: { user: SessionUser | null } | null } }>
    }
    const { data } = await auth.getSession()
    const user = data.session?.user ?? null
    const isAdmin = user ? await checkAdmin(user.id) : false
    setState({ user, isAdmin, loading: false })
  }, [checkAdmin])

  React.useEffect(() => {
    void refreshSession()
    const auth = supabase.auth as unknown as {
      onAuthStateChange: (cb: () => void) => { data: { subscription: { unsubscribe: () => void } } }
    }
    const { data: { subscription } } = auth.onAuthStateChange(() => {
      void refreshSession()
    })
    return () => subscription.unsubscribe()
  }, [refreshSession])

  type AuthResult<T> = { data: T; error: { message: string } | null }

  const signIn = async (email: string, password: string) => {
    const auth = supabase.auth as unknown as {
      signInWithPassword: (creds: { email: string; password: string }) => Promise<AuthResult<{ user: SessionUser | null }>>
    }
    return auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string) => {
    const auth = supabase.auth as unknown as {
      signUp: (creds: { email: string; password: string }) => Promise<AuthResult<{ user: SessionUser | null; identities: unknown[] | null }>>
    }
    return auth.signUp({ email, password })
  }

  const signOut = async () => {
    const auth = supabase.auth as unknown as { signOut: () => Promise<unknown> }
    await auth.signOut()
  }

  return { ...state, signIn, signUp, signOut, refreshSession }
}