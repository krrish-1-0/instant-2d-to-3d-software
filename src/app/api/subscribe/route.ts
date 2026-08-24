import { db } from "@/db";
import { subscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const source = String(body.source ?? "website").slice(0, 40);

    if (!EMAIL_RE.test(email)) {
      return Response.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    }

    await db.insert(subscribers).values({ email: email.slice(0, 200), source }).onConflictDoNothing();
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Subscription failed." }, { status: 500 });
  }
}
