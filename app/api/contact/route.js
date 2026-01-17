import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, company, email, phone, message } = body;

    await resend.emails.send({
      from: "SeatAI <onboarding@resend.dev>",
      to: ["ross@getseat.ai"],
      subject: "New SeatAI Lead",
      html: `
        <h2>New Lead</h2>
        <p><strong>Name:</strong> ${name || "-"}</p>
        <p><strong>Company:</strong> ${company || "-"}</p>
        <p><strong>Email:</strong> ${email || "-"}</p>
        <p><strong>Phone:</strong> ${phone || "-"}</p>
        <p><strong>Message:</strong><br/>${message || "-"}</p>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed" }), { status: 500 });
  }
}
