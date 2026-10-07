import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowUpRight, Menu, X, Mail, Phone, MapPin, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { contact } from '@/data/services'
import { usePrefs } from '@/lib/prefs'

export function Brand() { const { t } = usePrefs(); return <Link to="/" className="brand" aria-label={`Tech-Can Systems — ${t('Início', 'Home')}`}><svg className="brand-mark" viewBox="0 0 42 46" fill="none" aria-hidden="true"><path d="M21 2 39 12v21L21 44 3 33V12L21 2Z" stroke="currentColor" strokeWidth="2"/><path d="m29 15-8-5-10 6v14l10 6 8-5M11 16l10 6 10-6M21 22v14" stroke="currentColor" strokeWidth="2.5"/></svg><span className="brand-name">TECH-CAN<span className="brand-sub">SYSTEMS</span></span></Link> }

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { t, lang, setLang, theme, setTheme } = usePrefs()
  const [open, setOpen] = useState(false)
  const links = [{ to: '/' as const, label: t('Início', 'Home') }, { to: '/sobre' as const, label: t('Sobre nós', 'About us') }, { to: '/servicos' as const, label: t('Serviços', 'Services') }, { to: '/contactos' as const, label: t('Contactos', 'Contact') }]
  const cta = t('Vamos conversar', "Let's talk")
  const toggles = <>
    <Button variant="quiet" size="icon" className="lang-btn" onClick={() => setLang(lang === 'en' ? 'pt' : 'en')} aria-label={lang === 'en' ? 'Mudar para português' : 'Switch to English'}>{lang === 'en' ? 'PT' : 'EN'}</Button>
    <Button variant="quiet" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? t('Mudar para modo claro', 'Switch to light mode') : t('Mudar para modo escuro', 'Switch to dark mode')}>{theme === 'dark' ? <Sun /> : <Moon />}</Button>
  </>
  return <>
    <header className="site-header">
      <div className="wrap header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label={t('Navegação principal', 'Main navigation')}>{links.map(l => <Link key={l.to} to={l.to} className="nav-link" activeOptions={{ exact: true }}>{l.label}</Link>)}</nav>
        <div className="header-tools">
          {toggles}
          <Button variant="brand" asChild className="header-cta"><Link to="/contactos">{cta} <ArrowUpRight /></Link></Button>
          <Button variant="quiet" size="icon" className="menu-trigger" onClick={() => setOpen(!open)} aria-label={open ? t('Fechar menu', 'Close menu') : t('Abrir menu', 'Open menu')} aria-expanded={open}>{open ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {open && <nav className="mobile-nav" aria-label={t('Navegação móvel', 'Mobile navigation')}>
        {links.map(l => <Link key={l.to} to={l.to} className="nav-link" onClick={() => setOpen(false)} activeOptions={{ exact: true }}>{l.label}</Link>)}
        <div className="mobile-tools">{toggles}<Button variant="brand" asChild><Link to="/contactos" onClick={() => setOpen(false)}>{cta} <ArrowUpRight /></Link></Button></div>
      </nav>}
    </header>
    <main>{children}</main>
    <footer className="site-footer"><div className="wrap">
      <div className="footer-main">
        <div><Brand /><p className="footer-copy">{t('Tecnologia que conecta ideias, simplifica desafios e impulsiona o seu futuro.', 'Technology that connects ideas, simplifies challenges and drives your future.')}</p></div>
        <div><h3 className="footer-heading">{t('Explore', 'Explore')}</h3><div className="footer-links">{links.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}</div></div>
        <div><h3 className="footer-heading">{t('Fale connosco', 'Get in touch')}</h3><div className="footer-links">
          <a className="footer-contact" href="tel:+258852637473"><Phone />{contact.phone}</a>
          <a className="footer-contact" href="tel:+258878088000"><Phone />{contact.secondPhone}</a>
          <a className="footer-contact" href={`mailto:${contact.email}`}><Mail />{contact.email}</a>
          <span className="footer-contact"><MapPin />{t('Moçambique', 'Mozambique')}</span>
        </div></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Tech-Can Systems, Lda. {t('Todos os direitos reservados.', 'All rights reserved.')}</span><span>{t('Inovando o futuro da tecnologia.', 'Innovating the future of technology.')}</span></div>
    </div></footer>
  </>
}

export function ContactBand() { const { t } = usePrefs(); return <section className="cta-band"><div className="wrap cta-inner"><div><h2>{t('O próximo passo começa com uma conversa.', 'The next step starts with a conversation.')}</h2><p>{t('Conte-nos o seu desafio. Encontramos a solução certa para si.', 'Tell us about your challenge. We will find the right solution for you.')}</p></div><Button variant="brand" asChild><Link to="/contactos">{t('Fale com a nossa equipa', 'Talk to our team')} <ArrowUpRight /></Link></Button></div></section> }
