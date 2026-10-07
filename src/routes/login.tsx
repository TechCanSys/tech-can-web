import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Lock, Mail, LogIn, UserPlus, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { usePrefs } from '@/lib/prefs'
import { supabase } from '@/integrations/supabase/client'
import { Brand } from '@/components/site/site-shell'

type SessionUser = { id: string; email?: string | null; identities?: unknown[] | null } & Record<string, unknown>

type SupabaseAuth = {
  getSession: () => Promise<{ data: { session: { user: SessionUser | null } | null } }>
  signInWithPassword: (creds: { email: string; password: string }) => Promise<{ data: { user: SessionUser | null }; error: { message: string } | null }>
  signUp: (creds: { email: string; password: string }) => Promise<{ data: { user: SessionUser | null; identities: unknown[] | null }; error: { message: string } | null }>
  signOut: () => Promise<unknown>
}

type Mode = 'signin' | 'signup'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Iniciar sessão | Tech-Can Admin' },
      { description: 'Aceda ao painel administrativo da Tech-Can Systems.' },
    ],
  }),
  component: LoginPage,
})

function useNavigateAdmin() {
  // navigate() from @tanstack/react-router via useRouter is not resolving TS types properly,
  // so we fall back to window.location for robustness. Works for a redirect-only page.
  return (to: string) => { window.location.href = to }
}

function LoginPage() {
  const { t, lang } = usePrefs()
  const navigate = useNavigateAdmin()
  const [mode, setMode] = React.useState<Mode>('signin')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [msg, setMsg] = React.useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      const auth = supabase.auth as unknown as SupabaseAuth
      const { data } = await auth.getSession()
      const user = data.session?.user
      if (!user) return
      const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' })
      if (isAdmin && !cancelled) navigate('/admin')
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMsg(null)
    setBusy(true)
    try {
      const auth = supabase.auth as unknown as SupabaseAuth
      const res = mode === 'signin'
        ? await auth.signInWithPassword({ email, password })
        : await auth.signUp({ email, password })

      if (res.error) {
        setMsg({ type: 'err', text: res.error.message })
        return
      }

      if (mode === 'signup') {
        const user = res.data.user
        if (user?.identities && Array.isArray(user.identities) && user.identities.length === 0) {
          setMsg({ type: 'err', text: t('Este email já se encontra registado. Tente iniciar sessão.', 'This email is already registered. Try signing in.') })
          setMode('signin')
          return
        }
        setMsg({ type: 'ok', text: t('Conta criada! Inicie sessão com os seus dados.', 'Account created! Sign in with your credentials.') })
        setMode('signin')
        setPassword('')
        return
      }

      if (res.data.user) {
        const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: res.data.user.id, _role: 'admin' })
        if (!isAdmin) {
          setMsg({ type: 'err', text: t('A sua conta não tem permissões de administrador.', 'Your account does not have administrator privileges.') })
          await (supabase.auth as unknown as SupabaseAuth).signOut()
          return
        }
        navigate('/admin')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Brand />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {mode === 'signin' ? t('Iniciar sessão', 'Sign in') : t('Criar conta', 'Create account')}
            </CardTitle>
            <CardDescription>
              {mode === 'signin'
                ? t('Aceda ao painel de administração.', 'Access the administration panel.')
                : t('Registe a primeira conta (ela tornar-se-á admin automaticamente).', 'Register the first account (it will become admin automatically).')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              {msg && (
                <div className={`flex items-center gap-2 rounded-md p-3 text-sm ${
                  msg.type === 'ok' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}>
                  {msg.type === 'ok' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <span>{msg.text}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t('Email', 'Email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="nome@exemplo.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('Palavra-passe', 'Password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder={t('Mínimo 6 caracteres', 'Minimum 6 characters')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button type="submit" variant="brand" className="w-full" disabled={busy}>
                {mode === 'signin' ? <><LogIn />{busy ? t('A entrar...', 'Signing in...') : t('Entrar', 'Sign in')}</>
                                    : <><UserPlus />{busy ? t('A criar...', 'Creating...') : t('Criar conta', 'Create account')}</>}
              </Button>
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { setMsg(null); setMode(m => m === 'signin' ? 'signup' : 'signin'); setPassword('') }}
              >
                {mode === 'signin'
                  ? t('Não tem conta? Crie uma agora.', "Don't have an account? Create one now.")
                  : t('Já tem conta? Inicie sessão.', 'Already have an account? Sign in.')}
              </button>
              <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-3 w-3" />{t('Voltar ao site', 'Back to website')}
              </Link>
            </CardFooter>
          </form>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          ⚠️ {t('A primeira conta registada recebe automaticamente a função de admin.', 'The first registered account automatically receives the admin role.')}
        </p>
      </div>
    </div>
  )
}