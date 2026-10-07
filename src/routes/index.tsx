import { createFileRoute, Link } from '@tanstack/react-router'
import { useRef } from 'react'
import { ArrowUpRight, ArrowRight, ShieldCheck, Headphones, Network, Lightbulb, CheckCircle2, MapPin, ChevronLeft, ChevronRight, Info, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { services, pageHead } from '@/data/services'
import { projects, testimonials } from '@/data/portfolio'
import { usePrefs } from '@/lib/prefs'
import { ContactBand } from '@/components/site/site-shell'
import datacenter from '@/assets/techcan-datacenter.jpg'

export const Route = createFileRoute('/')({ head: () => pageHead('Soluções tecnológicas em Moçambique', 'Consultoria, suporte, desenvolvimento digital, infraestrutura e segurança. A Tech-Can Systems conecta a sua empresa ao futuro da tecnologia.'), component: Index })

function Index() {
  const { t } = usePrefs()
  const track = useRef<HTMLDivElement>(null)
  const scrollCarousel = (dir: number) => { const el = track.current; if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' }) }
  return <>
    <section className="hero">
      <img className="hero-photo" src={datacenter} alt={t('Infraestrutura tecnológica com servidores e equipamentos de rede', 'Technology infrastructure with servers and network equipment')} width={1920} height={1024} fetchPriority="high" />
      <div className="wrap hero-content reveal">
        <div className="eyebrow"><span className="status-dot" />{t('Tecnologia com propósito', 'Technology with purpose')}</div>
        <h1>Tech-Can Systems<span>.</span></h1>
        <p className="hero-tagline">{t('Inovando o futuro', 'Innovating the future')}<br />{t('da tecnologia.', 'of technology.')}</p>
        <p className="hero-desc">{t('Transformamos desafios em soluções. Da infraestrutura à inovação digital, conectamos o seu negócio a novas possibilidades.', 'We turn challenges into solutions. From infrastructure to digital innovation, we connect your business to new possibilities.')}</p>
        <div className="hero-actions">
          <Button variant="brand" asChild><Link to="/servicos">{t('Explore as nossas soluções', 'Explore our solutions')} <ArrowUpRight /></Link></Button>
          <Button variant="line" asChild><Link to="/contactos">{t('Fale connosco', 'Get in touch')} <ArrowRight /></Link></Button>
        </div>
        <div className="hero-note"><CheckCircle2 />{t('Soluções à sua medida. Compromisso com o seu sucesso.', 'Tailored solutions. Committed to your success.')}</div>
      </div>
      <div className="hero-index">{t('01 / CONECTADOS AO FUTURO', '01 / CONNECTED TO THE FUTURE')}</div>
    </section>
    <div className="capability-strip"><div className="wrap capability-inner">
      <div className="capability"><Lightbulb />{t('Soluções personalizadas', 'Tailored solutions')}</div>
      <div className="capability"><ShieldCheck />{t('Segurança em primeiro lugar', 'Security first')}</div>
      <div className="capability"><Headphones />{t('Suporte remoto e presencial', 'Remote and on-site support')}</div>
      <div className="capability"><Network />{t('Tecnologia que acompanha o seu crescimento', 'Technology that grows with you')}</div>
    </div></div>
    <section className="section"><div className="wrap">
      <div className="section-top">
        <div><div className="eyebrow">{t('O que fazemos', 'What we do')}</div><h2>{t('O seu desafio. A nossa solução.', 'Your challenge. Our solution.')}</h2><p className="section-lead">{t('Tudo o que a sua empresa precisa para evoluir, num só parceiro tecnológico.', 'Everything your company needs to evolve, from a single technology partner.')}</p></div>
        <Link className="section-link" to="/servicos">{t('Conheça todos os serviços', 'See all services')} <ArrowUpRight /></Link>
      </div>
      <div className="service-grid">{services.map((s, i) => <Link to="/servicos" search={{ area: s.id }} className="service-card" key={s.id}><img className="service-cover" src={s.cover} alt={t(s.title, s.titleEn)} loading="lazy" width={1024} height={640} /><div className="service-card-body"><div className="service-card-head"><s.icon className="service-icon" /><span className="service-number">0{i + 1}</span></div><h3>{t(s.title, s.titleEn)}</h3><p>{t(s.short, s.shortEn)}</p><span className="section-link">{t('Explorar soluções', 'Explore solutions')} <ArrowUpRight /></span></div></Link>)}</div>
    </div></section>
    <section className="section about-band"><div className="wrap about-layout">
      <div className="about-visual"><img src={datacenter} alt={t('Servidores que sustentam as operações de uma empresa', 'Servers supporting company operations')} width={1920} height={1024} loading="lazy" /><div className="about-label"><MapPin />{t('De Moçambique para o futuro.', 'From Mozambique to the future.')}</div></div>
      <div className="about-copy">
        <div className="eyebrow">{t('Mais do que tecnologia', 'More than technology')}</div>
        <h2>{t('Um parceiro para', 'A partner for')}<br />{t('as suas ambições.', 'your ambitions.')}</h2>
        <p className="section-lead">{t('Na Tech-Can Systems, Lda., acreditamos que a tecnologia deve simplificar a vida e abrir novas oportunidades. Unimos conhecimento técnico, inovação e proximidade para criar soluções que fazem a diferença.', 'At Tech-Can Systems, Lda., we believe technology should simplify life and open new opportunities. We combine technical expertise, innovation and proximity to build solutions that make a difference.')}</p>
        <p className="section-lead">{t('Apoiamos empresas, startups e pessoas em cada etapa da sua jornada digital, com qualidade, transparência e compromisso.', 'We support companies, startups and individuals at every step of their digital journey, with quality, transparency and commitment.')}</p>
        <Link className="section-link" to="/sobre">{t('Conheça a Tech-Can', 'Meet Tech-Can')} <ArrowUpRight /></Link>
      </div>
    </div></section>
    <section className="section"><div className="wrap">
      <div className="section-top">
        <div><div className="eyebrow">{t('Trabalhos', 'Our work')}</div><h2>{t('Resultados que falam por nós.', 'Results that speak for themselves.')}</h2><p className="section-lead">{t('Uma amostra do que podemos construir para a sua empresa.', 'A sample of what we can build for your company.')}</p></div>
        <div className="carousel-nav">
          <button className="carousel-btn" onClick={() => scrollCarousel(-1)} aria-label={t('Projeto anterior', 'Previous project')}><ChevronLeft /></button>
          <button className="carousel-btn" onClick={() => scrollCarousel(1)} aria-label={t('Projeto seguinte', 'Next project')}><ChevronRight /></button>
        </div>
      </div>
      <div className="carousel"><div className="carousel-track" ref={track}>{projects.map(p => <article className="carousel-slide project-card" key={p.id}><img src={p.image} alt={t(p.title, p.titleEn)} loading="lazy" width={1024} height={640} /><div className="project-body"><span className="project-tag">{t(p.tag, p.tagEn)}</span><h3>{t(p.title, p.titleEn)}</h3><p>{t(p.desc, p.descEn)}</p></div></article>)}</div></div>
      <p className="example-note"><Info />{t('Projetos de demonstração, para ilustrar os nossos serviços. Fale connosco para conhecer casos reais.', 'Demo projects, shown to illustrate our services. Talk to us to learn about real cases.')}</p>
    </div></section>
    <section className="section about-band"><div className="wrap">
      <div className="section-top"><div><div className="eyebrow">{t('Feedbacks', 'Testimonials')}</div><h2>{t('Quem trabalha connosco, recomenda.', 'Those who work with us, recommend us.')}</h2></div></div>
      <div className="testimonials-grid">{testimonials.map(r => <figure className="testimonial-card" key={r.id}><Quote aria-hidden="true" /><blockquote>{t(r.quote, r.quoteEn)}</blockquote><figcaption className="testimonial-person"><span className="avatar" aria-hidden="true">{r.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span><span><span className="testimonial-name">{r.name}</span><span className="testimonial-role">{t(r.role, r.roleEn)}</span></span></figcaption></figure>)}</div>
      <p className="example-note"><Info />{t('Feedbacks de demonstração. Serão substituídos por depoimentos reais dos nossos clientes.', 'Demo testimonials. These will be replaced with real client feedback.')}</p>
    </div></section>
    <ContactBand />
  </>
}
