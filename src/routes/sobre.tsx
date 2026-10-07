import { createFileRoute } from '@tanstack/react-router'
import { Target, Telescope, HeartHandshake } from 'lucide-react'
import { pageHead } from '@/data/services'
import { usePrefs } from '@/lib/prefs'
import { ContactBand } from '@/components/site/site-shell'
import datacenter from '@/assets/techcan-datacenter.jpg'

export const Route = createFileRoute('/sobre')({ head: () => pageHead('Sobre nós', 'Conheça a Tech-Can Systems, Lda., a nossa missão, visão e valores. Inovação, qualidade e compromisso com a transformação digital em Moçambique.'), component: AboutPage })

function AboutPage() {
  const { t } = usePrefs()
  const values = [
    { title: t('Inovação', 'Innovation'), text: t('Procuramos soluções modernas e eficazes para responder a desafios reais.', 'We pursue modern, effective solutions to real challenges.') },
    { title: t('Comprometimento', 'Commitment'), text: t('Trabalhamos com responsabilidade e dedicação ao sucesso de cada cliente.', "We work with responsibility and dedication to every client's success.") },
    { title: t('Transparência', 'Transparency'), text: t('Cultivamos relações honestas, éticas e claras em todas as etapas.', 'We build honest, ethical and clear relationships at every stage.') },
    { title: t('Qualidade', 'Quality'), text: t('Priorizamos o rigor técnico, a eficiência e a fiabilidade das soluções.', 'We prioritize technical rigor, efficiency and reliability.') },
    { title: t('Sustentabilidade', 'Sustainability'), text: t('Promovemos o uso responsável de recursos e o crescimento sustentável.', 'We promote responsible use of resources and sustainable growth.') },
  ]
  return <>
    <section className="page-intro"><div className="wrap">
      <div className="eyebrow">{t('Sobre a Tech-Can', 'About Tech-Can')}</div>
      <h1>{t('Inovação com propósito.', 'Purposeful innovation.')}<br />{t('Tecnologia com pessoas.', 'Technology with people.')}</h1>
      <p>{t('Somos a Tech-Can Systems, Lda., uma empresa de tecnologias de informação que transforma necessidades reais em soluções eficientes para empresas e indivíduos.', 'We are Tech-Can Systems, Lda., an information technology company that turns real needs into efficient solutions for companies and individuals.')}</p>
    </div></section>
    <section className="section"><div className="wrap about-layout">
      <div>
        <div className="eyebrow">{t('Quem somos', 'Who we are')}</div>
        <h2>{t('O seu futuro digital', 'Your digital future')}<br />{t('é o nosso compromisso.', 'is our commitment.')}</h2>
        <p className="section-lead">{t('Da manutenção de equipamentos à criação de soluções digitais, ajudamos a construir operações mais seguras, produtivas e preparadas para crescer.', 'From equipment maintenance to digital solutions, we help build operations that are safer, more productive and ready to grow.')}</p>
        <p className="section-lead">{t('Combinamos conhecimento técnico e atenção às necessidades de cada cliente. Mais do que fornecer tecnologia, queremos ser o parceiro que acompanha a evolução do seu negócio.', "We combine technical expertise with attention to each client's needs. More than supplying technology, we aim to be the partner that follows your business as it evolves.")}</p>
      </div>
      <div className="about-visual"><img src={datacenter} alt={t('Equipamentos e servidores numa infraestrutura tecnológica', 'Equipment and servers in a technology infrastructure')} width={1920} height={1024} loading="lazy" /></div>
    </div></section>
    <section className="section about-band"><div className="wrap">
      <div className="eyebrow">{t('O que nos move', 'What drives us')}</div>
      <h2>{t('Uma direção clara. Um compromisso real.', 'A clear direction. A real commitment.')}</h2>
      <div className="values-grid">
        <div className="value-block"><Target aria-hidden="true" /><h3>{t('Missão', 'Mission')}</h3><p>{t('Fornecer soluções tecnológicas inovadoras, eficientes e acessíveis que impulsionem o crescimento e a digitalização de empresas e indivíduos, com qualidade e segurança em cada serviço.', 'To provide innovative, efficient and accessible technology solutions that drive the growth and digitalization of companies and individuals, with quality and security in every service.')}</p></div>
        <div className="value-block"><Telescope aria-hidden="true" /><h3>{t('Visão', 'Vision')}</h3><p>{t('Ser uma referência em tecnologias de informação em Moçambique e noutros mercados, reconhecida pela excelência, inovação e impacto positivo na transformação digital.', 'To be a reference in information technology in Mozambique and other markets, recognized for excellence, innovation and positive impact on digital transformation.')}</p></div>
        <div className="value-block"><HeartHandshake aria-hidden="true" /><h3>{t('O nosso compromisso', 'Our commitment')}</h3><p>{t('Compreender os seus desafios, propor soluções adequadas e construir relações duradouras, assentes na confiança, na proximidade e na responsabilidade.', 'Understand your challenges, propose the right solutions and build lasting relationships based on trust, proximity and responsibility.')}</p></div>
      </div>
    </div></section>
    <section className="section"><div className="wrap">
      <div className="eyebrow">{t('Os nossos valores', 'Our values')}</div>
      <h2>{t('Princípios que se refletem no que fazemos.', 'Principles reflected in everything we do.')}</h2>
      <div className="values-list">{values.map(v => <div key={v.title}><h3>{v.title}</h3><p>{v.text}</p></div>)}</div>
    </div></section>
    <ContactBand />
  </>
}
