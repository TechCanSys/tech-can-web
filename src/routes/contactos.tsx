import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contact, services, pageHead } from "@/data/services";
import { usePrefs } from "@/lib/prefs";
import { sendContactRequestToTelegram } from "@/lib/contact-telegram.server";

const proposalEmail = "techcansystems@gmail.com";

export const Route = createFileRoute("/contactos")({
  head: () =>
    pageHead(
      "Contactos e pedidos de proposta",
      "Fale com a Tech-Can Systems. Ligue +258 852637473 ou +258 878088000, escreva para geral@techcansystems.site ou converse connosco pelo WhatsApp.",
    ),
  component: ContactPage,
});

function ContactPage() {
  const { t } = usePrefs();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const request = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      service: String(data.get("service") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    const body = `${t("Nome", "Name")}: ${request.name}\nEmail: ${request.email}\n${t("Empresa", "Company")}: ${request.company || t("Não indicada", "Not provided")}\n${t("Serviço", "Service")}: ${request.service}\n\n${request.message}`;
    const subject = `${t("Pedido de proposta", "Quote request")} — ${request.service}`;

    const telegramRequest = sendContactRequestToTelegram({ data: request });
    window.open(
      `mailto:${proposalEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setStatus("sending");

    try {
      await telegramRequest;
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }
  return (
    <>
      <section className="page-intro">
        <div className="wrap">
          <div className="eyebrow">{t("Vamos conversar", "Let's talk")}</div>
          <h1>
            {t("Boas soluções começam", "Good solutions start")}
            <br />
            {t("com uma boa conversa.", "with a good conversation.")}
          </h1>
          <p>
            {t(
              "Precisa de apoio técnico ou tem um projeto em mente? Fale com a nossa equipa e descubra como podemos ajudar.",
              "Need technical support or have a project in mind? Talk to our team and find out how we can help.",
            )}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="wrap contact-layout">
          <div>
            <div className="eyebrow">{t("Estamos ao seu alcance", "How to reach us")}</div>
            <div className="contact-item">
              <small>{t("Telefone", "Phone")}</small>
              <a href="tel:+258852637473">{contact.phone}</a>
              <a href="tel:+258878088000">{contact.secondPhone}</a>
            </div>
            <div className="contact-item">
              <small>Email</small>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
            <div className="contact-item">
              <small>{t("Converse connosco", "Chat with us")}</small>
              <Button variant="line" asChild>
                <a
                  href={`${contact.whatsapp}?text=${encodeURIComponent(t("Olá, Tech-Can Systems! Gostaria de saber mais sobre os vossos serviços.", "Hello, Tech-Can Systems! I would like to learn more about your services."))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle />
                  {t("Falar pelo WhatsApp", "Chat on WhatsApp")} <ArrowUpRight />
                </a>
              </Button>
            </div>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <h2>{t("Conte-nos o que precisa.", "Tell us what you need.")}</h2>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">{t("Nome", "Name")} *</label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder={t("O seu nome", "Your name")}
                  required
                  maxLength={150}
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("O seu email", "Your email")}
                  required
                />
              </div>
              <div className="field field-wide">
                <label htmlFor="company">{t("Empresa", "Company")}</label>
                <input
                  id="company"
                  name="company"
                  autoComplete="organization"
                  placeholder={t("Nome da empresa (opcional)", "Company name (optional)")}
                  maxLength={150}
                />
              </div>
              <div className="field field-wide">
                <label htmlFor="service">{t("Serviço de interesse", "Service of interest")}</label>
                <select name="service" id="service">
                  <option>{t("Gostaria de orientação", "I'd like guidance")}</option>
                  {services.map((s) => (
                    <option key={s.id}>{t(s.title, s.titleEn)}</option>
                  ))}
                </select>
              </div>
              <div className="field field-wide">
                <label htmlFor="message">{t("Mensagem", "Message")} *</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={t(
                    "Fale-nos sobre o seu projeto ou desafio…",
                    "Tell us about your project or challenge…",
                  )}
                  required
                  maxLength={3000}
                />
              </div>
            </div>
            <p className="form-note">
              {t(
                "Ao submeter, o email será preparado para techcansystems@gmail.com e o pedido enviado ao Telegram (após configurar o bot no servidor). Confirme o envio do email na sua aplicação.",
                "Submitting prepares an email to techcansystems@gmail.com and sends the request to Telegram (once the server bot is configured). Confirm sending the email in your email app.",
              )}
            </p>
            <Button variant="brand" type="submit" disabled={status === "sending"}>
              <Send />
              {status === "sending"
                ? t("A enviar pedido…", "Sending request…")
                : t("Enviar pedido", "Send request")}{" "}
              <ArrowUpRight />
            </Button>
            {status === "sent" && (
              <p className="form-note" role="status">
                {t(
                  "Pedido enviado ao Telegram e email preparado. Confirme o envio na sua aplicação de email.",
                  "Request sent to Telegram and email prepared. Confirm sending in your email app.",
                )}
              </p>
            )}
            {status === "error" && (
              <p className="form-note" role="alert">
                {t(
                  "O email foi preparado, mas não foi possível enviar ao Telegram. Verifique a configuração do bot ou tente novamente. Confirme o envio do email na sua aplicação.",
                  "The email was prepared, but the request could not be sent to Telegram. Check the bot configuration or try again. Confirm sending the email in your email app.",
                )}
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
