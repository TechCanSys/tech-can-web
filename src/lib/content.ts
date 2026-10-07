import { queryOptions } from '@tanstack/react-query'
import { Wrench, Code2, Network, ShieldCheck, Workflow, GraduationCap, Lightbulb, Server, Smartphone, Cloud, type LucideIcon } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import type { Tables } from '@/integrations/supabase/types'
import { services as staticServices, contact as staticContact } from '@/data/services'
import { projects as staticProjects } from '@/data/portfolio'
import coverSupport from '@/assets/service-support.jpg'
import coverDigital from '@/assets/service-digital.jpg'
import coverNetwork from '@/assets/service-network.jpg'
import coverSecurity from '@/assets/service-security.jpg'
import coverBusiness from '@/assets/service-business.jpg'
import coverTraining from '@/assets/service-training.jpg'

export type ServiceRow = Tables<'services'>
export type ProjectRow = Tables<'projects'>
export type ContentRow = Tables<'site_content'>

export interface ServiceView {
  id: string
  slug: string
  title: string
  titleEn: string
  short: string
  shortEn: string
  category: string
  icon: LucideIcon
  cover: string
  items: string[]
  itemsEn: string[]
  position: number
}

export interface ProjectView {
  id: string
  slug: string
  tag: string
  tagEn: string
  title: string
  titleEn: string
  desc: string
  descEn: string
  image: string
  position: number
}

export const iconMap: Record<string, LucideIcon> = { Wrench, Code2, Network, ShieldCheck, Workflow, GraduationCap, Lightbulb, Server, Smartphone, Cloud }
export const categories = ['Operações', 'Digital', 'Segurança', 'Formação'] as const

const fallbackImages: Record<string, string> = {
  consultoria: coverSupport, digital: coverDigital, infraestrutura: coverNetwork, seguranca: coverSecurity, empresarial: coverBusiness, formacao: coverTraining,
  erp: coverBusiness, ecommerce: coverDigital, rede: coverNetwork, cftv: coverSecurity, suporte: coverSupport,
}
export const imageFor = (row: { slug: string; image_url: string | null }) => row.image_url || fallbackImages[row.slug] || coverBusiness

const now = new Date(0).toISOString()
const fallbackServiceRows: ServiceRow[] = staticServices.map((s, i) => ({ id: s.id, slug: s.id, title: s.title, title_en: s.titleEn, short: s.short, short_en: s.shortEn, category: s.category, icon: Object.keys(iconMap).find(k => iconMap[k] === s.icon) ?? 'Wrench', image_url: null, items: s.items, items_en: s.itemsEn, position: i + 1, published: true, created_at: now, updated_at: now }))
const fallbackProjectRows: ProjectRow[] = staticProjects.map((p, i) => ({ id: p.id, slug: p.id, tag: p.tag, tag_en: p.tagEn, title: p.title, title_en: p.titleEn, description: p.desc, description_en: p.descEn, image_url: null, position: i + 1, published: true, created_at: now, updated_at: now }))

function serviceRowToView(row: ServiceRow): ServiceView {
  const icon = iconMap[row.icon] ?? Wrench
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleEn: row.title_en,
    short: row.short,
    shortEn: row.short_en,
    category: row.category,
    icon,
    cover: imageFor(row),
    items: row.items,
    itemsEn: row.items_en,
    position: row.position,
  }
}

function projectRowToView(row: ProjectRow): ProjectView {
  return {
    id: row.id,
    slug: row.slug,
    tag: row.tag,
    tagEn: row.tag_en,
    title: row.title,
    titleEn: row.title_en,
    desc: row.description,
    descEn: row.description_en,
    image: imageFor(row),
    position: row.position,
  }
}

export const servicesQuery = queryOptions({
  queryKey: ['public', 'services'],
  queryFn: async (): Promise<ServiceView[]> => {
    const { data, error } = await supabase.from('services').select('*').eq('published', true).order('position')
    const rows = (error || !data) ? fallbackServiceRows : data
    return rows.map(serviceRowToView)
  },
})

export const projectsQuery = queryOptions({
  queryKey: ['public', 'projects'],
  queryFn: async (): Promise<ProjectView[]> => {
    const { data, error } = await supabase.from('projects').select('*').eq('published', true).order('position')
    const rows = (error || !data) ? fallbackProjectRows : data
    return rows.map(projectRowToView)
  },
})

export const contentQuery = queryOptions({
  queryKey: ['public', 'content'],
  queryFn: async (): Promise<ContentRow[]> => {
    const { data, error } = await supabase.from('site_content').select('*')
    if (error || !data) return []
    return data
  },
})

export interface SiteText { pt: string; en: string }
export const defaultTexts: Record<string, SiteText> = {
  hero_eyebrow: { pt: 'Tecnologia com propósito', en: 'Technology with purpose' },
  hero_tagline: { pt: 'Inovando o futuro da tecnologia.', en: 'Innovating the future of technology.' },
  hero_desc: { pt: 'Transformamos desafios em soluções. Da infraestrutura à inovação digital, conectamos o seu negócio a novas possibilidades.', en: 'We turn challenges into solutions. From infrastructure to digital innovation, we connect your business to new possibilities.' },
  contact_phone: { pt: staticContact.phone, en: staticContact.phone },
  contact_phone2: { pt: staticContact.secondPhone, en: staticContact.secondPhone },
  contact_email: { pt: staticContact.email, en: staticContact.email },
  contact_whatsapp: { pt: '258852637473', en: '258852637473' },
}

export function buildTexts(rows: ContentRow[] | undefined): Record<string, SiteText> {
  const out = { ...defaultTexts }
  for (const r of rows ?? []) out[r.key] = { pt: r.value_pt, en: r.value_en || r.value_pt }
  return out
}

export function buildContact(texts: Record<string, SiteText>) {
  const digits = (s: string) => s.replace(/[^\d+]/g, '')
  const wa = texts['contact_whatsapp']!.pt.replace(/\D/g, '')
  return {
    phone: texts['contact_phone']!.pt, phoneHref: `tel:${digits(texts['contact_phone']!.pt)}`,
    secondPhone: texts['contact_phone2']!.pt, secondPhoneHref: `tel:${digits(texts['contact_phone2']!.pt)}`,
    email: texts['contact_email']!.pt,
    whatsapp: `https://wa.me/${wa}`,
  }
}
