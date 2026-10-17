import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactRequestSchema = z.object({
  name: z.string().trim().min(1).max(150),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(150),
  service: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(3000),
});

function isTelegramSuccess(value: unknown): value is { ok: true } {
  return typeof value === "object" && value !== null && "ok" in value && value.ok === true;
}

export const sendContactRequestToTelegram = createServerFn({ method: "POST" })
  .validator(contactRequestSchema)
  .handler(async ({ data }) => {
    const token = process.env["TELEGRAM_BOT_TOKEN"];
    const chatId = process.env["TELEGRAM_CHAT_ID"];

    if (!token || !chatId || !/^-?\d+$/.test(chatId)) {
      throw new Error("Telegram bot is not configured with a valid chat ID");
    }

    const text = [
      "Novo pedido de contacto — Tech-Can Systems",
      `Nome: ${data.name}`,
      `Email: ${data.email}`,
      `Empresa: ${data.company || "Não indicada"}`,
      `Serviço: ${data.service}`,
      "",
      data.message,
    ].join("\n");

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(10_000),
    });

    const result: unknown = await response.json();
    if (!response.ok || !isTelegramSuccess(result)) {
      throw new Error(`Telegram delivery failed with status ${response.status}`);
    }
  });
