import { db } from "@/db";
import { projects, subscribers } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [projectCount] = await db.select({ count: sql<number>`count(*)::int` }).from(projects);
    const [objectSum] = await db
      .select({ total: sql<number>`coalesce(sum(${projects.objectCount}), 0)::int` })
      .from(projects);
    const [subscriberCount] = await db.select({ count: sql<number>`count(*)::int` }).from(subscribers);

    return Response.json({
      ok: true,
      stats: {
        projects: projectCount?.count ?? 0,
        objects: objectSum?.total ?? 0,
        subscribers: subscriberCount?.count ?? 0,
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Failed to load stats" }, { status: 500 });
  }
}
