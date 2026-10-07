import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { services, pageHead } from '@/data/services'
import { usePrefs } from '@/lib/prefs'
import { ContactBand } from '@/components/site/site-shell'

export const Route = createFileRoute('/servicos')({ validateSearch: (search: Record<string, unknown>): { area?: string } => typeof search['area'] === 'string' ? { area: search['area'] } : {}, head: () => pageHead('Serviços e soluções', 'Explore consultoria, suporte, desenvolvimento web, redes e cloud, segurança, automação, equipamentos e formação da Tech-Can Systems.'), component: ServicesPage })

const catEn: Record<string, string> = { 'Operações': 'Operations', 'Digital': 'Digital', 'Segurança': 'Security', 'Formação': 'Training' }

function ServicesPage() {
  const { t, lang } = usePrefs()
  const { area } = Route.useSearch()
  const [filter, setFilter] = useState('all')
  const filters = [{ key: 'all', label: t('Todos', 'All') }, { key: 'Operações', label: t('Operações', 'Operations') }, { key: 'Digital', label: 'Digital' }, { key: 'Segurança', label: t('Segurança', 'Security') }, { key: 'Formação', label: t('Formação', 'Training') }]
  const selected = services.find(s => s.id === area)
  const visible = filter === 'all' ? services : services.filter(s => s.category === filter)
  const ordered = selected && filter === 'all' ? [selected, ...visible.filter(s => s.id !== selected.id)] : visible
  return <>
    <section className="page-intro"><div className="wrap">
      <div className="eyebrow">{t('As nossas soluções', 'Our solutions')}</div>
      <h1>{t('Tecnologia que trabalha', 'Technology that works')}<br />{t('a favor do seu negócio.', 'for your business.')}</h1>
      <p>{t('Da estratégia à implementação, reunimos serviços complementares para simplificar operações, proteger o seu investimento e acelerar o crescimento.', 'From strategy to implementation, we bring together complementary services to simplify operations, protect your investment and accelerate growth.')}</p>
    </div></section>
    <section className="section"><div className="wrap">
      <div className="filter-bar" aria-label={t('Categorias de serviços', 'Service categories')}>{filters.map(f => <Button key={f.key} variant="line" className={filter === f.key ? 'filter-active' : ''} onClick={() => setFilter(f.key)} aria-pressed={filter === f.key}>{f.label}</Button>)}</div>
      <div className="service-grid">{ordered.map(s => <article key={s.id} className="service-card"><img className="service-cover" src={s.cover} alt={t(s.title, s.titleEn)} loading="lazy" width={1024} height={640} /><div className="service-card-body"><div className="service-card-head"><s.icon className="service-icon" /><span className="service-number">{t(s.category, catEn[s.category] ?? s.category)}</span></div><h3>{t(s.title, s.titleEn)}</h3><p>{t(s.short, s.shortEn)}</p><ul>{(lang === 'en' ? s.itemsEn : s.items).map(item => <li key={item}><Check />{item}</li>)}</ul></div></article>)}</div>
    </div></section>
    <ContactBand />
  </>
}
