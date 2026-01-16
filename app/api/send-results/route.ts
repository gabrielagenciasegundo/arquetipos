import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime = "nodejs"; // importante: nodemailer precisa de runtime Node

const PayloadSchema = z.object({
  personalData: z.object({
    nome: z.string().min(1),
    email: z.string().email(),
    Whatsapp: z.string().min(6),
  }),
  scores: z.array(
    z.object({
      archetype: z.any(), // ajuste conforme seu tipo real
      score: z.number(),
      percentage: z.number(),
    })
  ).min(1),
  top: z.array(
    z.object({
      archetype: z.any(),
      score: z.number(),
      percentage: z.number(),
    })
  ).optional(),
});

function archetypeName(a: any) {
  // adapte se seu "archetype" for objeto com "name"/"title"
  if (typeof a === "string") return a;
  if (a?.name) return String(a.name);
  if (a?.title) return String(a.title);
  return "Arquétipo";
}


export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = PayloadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Payload inválido", details: parsed.error.flatten() },
        { status: 400 }
      );
    }


    const { personalData, scores, top } = parsed.data;

    const host = process.env.SMTP_HOST!;
    const port = Number(process.env.SMTP_PORT || "465");
    const user = process.env.SMTP_USER!;
    const pass = process.env.SMTP_PASS!;
    const to = process.env.MAIL_TO || "lucas@segundodesign.com";
    const from = process.env.MAIL_FROM || user;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 SSL; 587 STARTTLS
      auth: { user, pass },
    });

    const topList = (top && top.length ? top : scores.slice(0, 3))
      .map((s, i) => `${i + 1}. ${archetypeName(s.archetype)} — ${s.score} (${s.percentage.toFixed(1)}%)`)
      .join("\n");

    const scoresTable = scores
      .slice()
      .sort((a, b) => b.score - a.score)
      .map((s) => `- ${archetypeName(s.archetype)}: ${s.score} (${s.percentage.toFixed(1)}%)`)
      .join("\n");

    const subject = `Resultado do Teste de Arquétipos — ${personalData.nome}`;

    const text = [
      "Novo resultado do Teste de Arquétipos",
      "",
      "Dados do participante:",
      `Nome: ${personalData.nome}`,
      `Email: ${personalData.email}`,
      `WhatsApp: ${personalData.Whatsapp}`,
      "",
      "Top arquétipos:",
      topList,
      "",
      "Todos os scores:",
      scoresTable,
      "",
      `Data: ${new Date().toISOString()}`,
    ].join("\n");
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      // Você pode usar Reply-To para facilitar retorno ao participante
      replyTo: personalData.email,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "Falha ao enviar e-mail",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
