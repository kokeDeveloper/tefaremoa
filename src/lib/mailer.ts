import { NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;

export type MailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export class MailerError extends Error {}

export async function sendMail({ to, subject, text, html }: MailPayload) {
  if (!RESEND_API_KEY || !RESEND_FROM) {
    throw new MailerError("Faltan credenciales de correo (RESEND_API_KEY/RESEND_FROM).");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [to],
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.message || "Fallo al enviar correo";
    throw new MailerError(message);
  }
}
