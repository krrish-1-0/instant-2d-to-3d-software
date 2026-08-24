import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        thumbnail: projects.thumbnail,
        objectCount: projects.objectCount,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .where(eq(projects.isPublic, true))
      .orderBy(desc(projects.updatedAt))
      .limit(24);

    return Response.json({ ok: true, items: rows });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, items: [], error: "Failed to load gallery" }, { status: 500 });
  }
}
