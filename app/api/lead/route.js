import { Resend } from "resend";

export async function POST(req) {
  const { name = "", company = "", email = "", phone = "", message = "" } =
    (await req.json()) || {};

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.LEADS_FROM_EMAIL || "SeatAI Leads <onboarding@resend.dev>",
    to: process.env.LEADS_TO_EMAIL,
    subject: `New SeatAI lead${company ? ` — ${company}` : ""}`,
    text: `Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}
Message: ${message}`,
  });

  return Response.json({ ok: true });
}

