import { db } from "@/db";
import { leads } from "@/db/schema";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const message = String(body.message ?? "").trim();
    const company = body.company ? String(body.company).trim() : null;
    const topic = String(body.topic ?? "general").trim();

    if (name.length < 2) return Response.json({ ok: false, error: "Please enter your name." }, { status: 400 });
    if (!EMAIL_RE.test(email)) return Response.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    if (message.length < 10)
      return Response.json({ ok: false, error: "Message must be at least 10 characters." }, { status: 400 });

    await db.insert(leads).values({
      id: randomUUID(),
      name: name.slice(0, 120),
      email: email.slice(0, 200),
      company: company?.slice(0, 160) ?? null,
      topic: topic.slice(0, 40),
      message: message.slice(0, 4000),
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Could not send message." }, { status: 500 });
  }
}
