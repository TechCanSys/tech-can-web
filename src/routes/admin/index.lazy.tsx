import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Wrench, Briefcase, Mail, FileText, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePrefs } from '@/lib/prefs'
import { supabase } from '@/integrations/supabase/client'

type QuoteStatus = 'novo' | 'em_andamento' | 'concluido' | 'arquivado'
type RequestRow = { status: QuoteStatus; created_at: string }

type IconComp = React.ComponentType<{ className?: string }>

export const Route = createLazyFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { t, lang } = usePrefs()

  const servicesQ = useQuery({
    queryKey: ['admin', 'services', 'count'],
    queryFn: async () => (await supabase.from('services').select('*', { count: 'exact', head: true })).count ?? 0,
  })
  const projectsQ = useQuery({
    queryKey: ['admin', 'projects', 'count'],
    queryFn: async () => (await supabase.from('projects').select('*', { count: 'exact', head: true })).count ?? 0,
  })
  const requestsQ = useQuery({
    queryKey: ['admin', 'requests'],
    queryFn: async () => {
      const { data } = await supabase
        .from('quote_requests')
        .select('status, created_at')
        .order('created_at', { ascending: false })
      return (data ?? []) as RequestRow[]
    },
  })

  const rows = requestsQ.data ?? []
  const totalRequests = rows.length
  const newRequests = rows.filter((r: RequestRow) => r.status === 'novo').length

  const stats: { label: string; labelEn: string; value: React.ReactNode; to: string; icon: IconComp; tone: string }[] = [
    { label: 'Serviços',      labelEn: 'Services',       value: servicesQ.data ?? '—', to: '/admin/servicos', icon: Wrench,      tone: 'bg-blue-500/10 text-blue-500' },
    { label: 'Projetos',      labelEn: 'Projects',       value: projectsQ.data ?? '—', to: '/admin/projetos', icon: Briefcase,    tone: 'bg-purple-500/10 text-purple-500' },
    { label: 'Novos pedidos', labelEn: 'New requests',   value: newRequests,          to: '/admin/pedidos',  icon: AlertCircle,  tone: 'bg-amber-500/10 text-amber-500' },
    { label: 'Total pedidos', labelEn: 'Total requests', value: totalRequests,        to: '/admin/pedidos',  icon: Mail,         tone: 'bg-green-500/10 text-green-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('Painel de administração', 'Admin dashboard')}</h1>
        <p className="text-muted-foreground mt-1">{t('Bem-vindo. Gere o conteúdo do website a partir daqui.', 'Welcome. Manage website content from here.')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Link key={s.to} to={s.to} className="group">
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/40">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t(s.label, s.labelEn)}</p>
                    <p className="text-3xl font-bold mt-2">{s.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-lg ${s.tone}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  {t('Ver detalhes', 'View details')} <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail />{t('Pedidos recentes', 'Recent requests')}</CardTitle>
            <CardDescription>{t('Últimas mensagens recebidas.', 'Last messages received.')}</CardDescription>
          </CardHeader>
          <CardContent>
            {requestsQ.isLoading && <div className="text-sm text-muted-foreground animate-pulse">{t('A carregar...', 'Loading...')}</div>}
            {!requestsQ.isLoading && rows.length === 0 && (
              <div className="text-sm text-muted-foreground py-4 text-center">{t('Ainda não há pedidos.', 'No requests yet.')}</div>
            )}
            {rows.length > 0 && (
              <div className="space-y-2">
                {rows.slice(0, 6).map((r: RequestRow, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      {r.status === 'novo'
                        ? <Clock className="h-4 w-4 text-amber-500" />
                        : <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      <span className="text-sm">{t('Pedido', 'Request')} #{i + 1}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-MZ')}
                    </span>
                  </div>
                ))}
                <Link to="/admin/pedidos" className="inline-flex items-center text-sm text-primary hover:underline pt-2">
                  {t('Ver todos os pedidos', 'View all requests')} <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText />{t('Ações rápidas', 'Quick actions')}</CardTitle>
            <CardDescription>{t('Tarefas mais frequentes.', 'Most frequent tasks.')}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
              <Link to="/admin/servicos"><Wrench className="h-5 w-5" />{t('Gerir serviços', 'Manage services')}</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
              <Link to="/admin/projetos"><Briefcase className="h-5 w-5" />{t('Gerir projetos', 'Manage projects')}</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
              <Link to="/admin/pedidos"><Mail className="h-5 w-5" />{t('Ver pedidos', 'View requests')}</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
              <Link to="/admin/conteudo"><FileText className="h-5 w-5" />{t('Editar conteúdo', 'Edit content')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}