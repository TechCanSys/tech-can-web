import * as React from 'react'
import { createLazyFileRoute, Link, Outlet } from '@tanstack/react-router'
import {
  LayoutDashboard, Wrench, Briefcase, Mail, FileText,
  LogOut, Menu, X, ChevronRight, ShieldCheck, Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePrefs } from '@/lib/prefs'
import { supabase } from '@/integrations/supabase/client'
import { Brand } from '@/components/site/site-shell'

type SessionUser = { id: string; email?: string | null } & Record<string, unknown>
type SupabaseAuth = {
  getSession: () => Promise<{ data: { session: { user: SessionUser | null } | null } }>
  signOut: () => Promise<unknown>
}

const navigateTo = (to: string) => { window.location.href = to }

export const Route = createLazyFileRoute('/admin')({
  component: AdminLayout,
})

type IconComp = React.ComponentType<{ className?: string }>
type NavItem = { to: string; label: string; labelEn: string; icon: IconComp }

function AdminLayout() {
  const { t, lang } = usePrefs()
  const [open, setOpen] = React.useState(false)
  const [checking, setChecking] = React.useState(true)
  const [allowed, setAllowed] = React.useState(false)
  const [userEmail, setUserEmail] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      const auth = supabase.auth as unknown as SupabaseAuth
      const { data } = await auth.getSession()
      const user = data.session?.user
      if (!user && !cancelled) {
        navigateTo('/login')
        return
      }
      if (user) {
        const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' })
        if (!isAdmin && !cancelled) {
          await auth.signOut()
          navigateTo('/login')
          return
        }
        if (!cancelled) {
          setAllowed(true)
          setUserEmail(user.email ?? null)
        }
      }
      if (!cancelled) setChecking(false)
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('A verificar permissões...', 'Checking permissions...')}</div>
      </div>
    )
  }
  if (!allowed) return null

  const nav: NavItem[] = [
    { to: '/admin',          label: 'Painel',       labelEn: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/servicos', label: 'Serviços',     labelEn: 'Services',  icon: Wrench },
    { to: '/admin/projetos', label: 'Projetos',     labelEn: 'Projects',  icon: Briefcase },
    { to: '/admin/pedidos',  label: 'Pedidos',      labelEn: 'Requests',  icon: Mail },
    { to: '/admin/conteudo', label: 'Conteúdo',     labelEn: 'Content',   icon: FileText },
  ]

  const handleLogout = async () => {
    const auth = supabase.auth as unknown as SupabaseAuth
    await auth.signOut()
    navigateTo('/login')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar desktop */}
        <aside className="hidden lg:flex w-64 border-r flex-col bg-card/40">
          <div className="p-4 border-b"><Brand /></div>
          <nav className="flex-1 p-3 space-y-1">
            {nav.map(n => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === '/admin' }}
                className="nav-link !justify-start gap-3 px-3 py-2"
              >
                <n.icon className="h-4 w-4" />
                <span>{t(n.label, n.labelEn)}</span>
              </Link>
            ))}
          </nav>
          <div className="p-3 border-t space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="truncate">{userEmail ?? '—'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">{t('Administrador', 'Administrator')}</span>
            </div>
            <Button variant="quiet" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />{t('Terminar sessão', 'Sign out')}
            </Button>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="h-14 px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="quiet" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
                  {open ? <X /> : <Menu />}
                </Button>
                <div className="lg:hidden"><Brand /></div>
                <div className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground">
                  <Link to="/" className="hover:text-foreground transition-colors">Site</Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground font-medium">{t('Admin', 'Admin')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/" target="_blank" className="hidden sm:inline-flex">
                  <Button variant="quiet" size="sm">{t('Ver site', 'View site')}</Button>
                </Link>
                <Button variant="quiet" size="icon" className="lg:hidden" onClick={handleLogout} aria-label="Sair">
                  <LogOut />
                </Button>
              </div>
            </div>
            {open && (
              <nav className="lg:hidden border-t p-3 space-y-1 bg-card/60">
                {nav.map(n => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: n.to === '/admin' }}
                    className="nav-link !justify-start gap-3 px-3 py-2"
                  >
                    <n.icon className="h-4 w-4" />
                    <span>{t(n.label, n.labelEn)}</span>
                  </Link>
                ))}
                <div className="pt-2 border-t space-y-2">
                  <div className="flex items-center gap-2 px-3 py-1 text-xs text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="truncate">{userEmail ?? '—'}</span>
                  </div>
                  <Button variant="quiet" className="w-full justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />{t('Terminar sessão', 'Sign out')}
                  </Button>
                </div>
              </nav>
            )}
          </header>
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}