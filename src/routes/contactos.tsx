import { createFileRoute } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { ArrowUpRight, MessageCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { contact, services, pageHead } from '@/data/services'
import { usePrefs } from '@/lib/prefs'

export const Route = createFileRoute('/contactos')({ head: () => pageHead('Contactos e pedidos de proposta', 'Fale com a Tech-Can Systems. Ligue +258 852637473 ou +258 878088000, escreva para geral@techcansystems.site ou converse connosco pelo WhatsApp.'), component: ContactPage })

function ContactPage() {
  const { t } = usePrefs()
  const [prepared, setPrepared] = useState(false)
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const body = `${t('Nome', 'Name')}: ${data.get('name')}\nEmail: ${data.get('email')}\n${t('Empresa', 'Company')}: ${data.get('company') || t('Não indicada', 'Not provided')}\n${t('Serviço', 'Service')}: ${data.get('service')}\n\n${data.get('message')}`
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`${t('Pedido de proposta', 'Quote request')} — ${data.get('service')}`)}&body=${encodeURIComponent(body)}`
    setPrepared(true)
  }
  return <>
    <section className="page-intro"><div className="wrap">
      <div className="eyebrow">{t('Vamos conversar', "Let's talk")}</div>
      <h1>{t('Boas soluções começam', 'Good solutions start')}<br />{t('com uma boa conversa.', 'with a good conversation.')}</h1>
      <p>{t('Precisa de apoio técnico ou tem um projeto em mente? Fale com a nossa equipa e descubra como podemos ajudar.', 'Need technical support or have a project in mind? Talk to our team and find out how we can help.')}</p>
    </div></section>
    <section className="section"><div className="wrap contact-layout">
      <div>
        <div className="eyebrow">{t('Estamos ao seu alcance', 'How to reach us')}</div>
        <div className="contact-item"><small>{t('Telefone', 'Phone')}</small><a href="tel:+258852637473">{contact.phone}</a><a href="tel:+258878088000">{contact.secondPhone}</a></div>
        <div className="contact-item"><small>Email</small><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
        <div className="contact-item"><small>{t('Converse connosco', 'Chat with us')}</small><Button variant="line" asChild><a href={`${contact.whatsapp}?text=${encodeURIComponent(t('Olá, Tech-Can Systems! Gostaria de saber mais sobre os vossos serviços.', 'Hello, Tech-Can Systems! I would like to learn more about your services.'))}`} target="_blank" rel="noopener noreferrer"><MessageCircle />{t('Falar pelo WhatsApp', 'Chat on WhatsApp')} <ArrowUpRight /></a></Button></div>
      </div>
      <form className="contact-form" onSubmit={submit}>
        <h2>{t('Conte-nos o que precisa.', 'Tell us what you need.')}</h2>
        <div className="form-grid">
          <div className="field"><label htmlFor="name">{t('Nome', 'Name')} *</label><input id="name" name="name" autoComplete="name" placeholder={t('O seu nome', 'Your name')} required maxLength={150} /></div>
          <div className="field"><label htmlFor="email">Email *</label><input id="email" name="email" type="email" autoComplete="email" placeholder={t('O seu email', 'Your email')} required /></div>
          <div className="field field-wide"><label htmlFor="company">{t('Empresa', 'Company')}</label><input id="company" name="company" autoComplete="organization" placeholder={t('Nome da empresa (opcional)', 'Company name (optional)')} maxLength={150} /></div>
          <div className="field field-wide"><label htmlFor="service">{t('Serviço de interesse', 'Service of interest')}</label><select name="service" id="service"><option>{t('Gostaria de orientação', "I'd like guidance")}</option>{services.map(s => <option key={s.id}>{t(s.title, s.titleEn)}</option>)}</select></div>
          <div className="field field-wide"><label htmlFor="message">{t('Mensagem', 'Message')} *</label><textarea id="message" name="message" placeholder={t('Fale-nos sobre o seu projeto ou desafio…', 'Tell us about your project or challenge…')} required maxLength={4000} /></div>
        </div>
        <p className="form-note">{t('O pedido será preparado na sua aplicação de email para que possa rever e enviar. Também pode contactar-nos diretamente por telefone ou WhatsApp.', 'Your request will be prepared in your email app so you can review and send it. You can also reach us directly by phone or WhatsApp.')}</p>
        <Button variant="brand" type="submit"><Mail />{t('Preparar pedido por email', 'Prepare email request')} <ArrowUpRight /></Button>
        {prepared && <p className="form-note" role="status">{t('O pedido foi preparado. Confirme o envio na sua aplicação de email. Se não abrir, escreva diretamente para', 'Your request was prepared. Confirm sending in your email app. If it does not open, write directly to')} {contact.email}.</p>}
      </form>
    </div></section>
  </>
}
