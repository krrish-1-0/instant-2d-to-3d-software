import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select({
        id: projects.id,
        name: projects.name,
        thumbnail: projects.thumbnail,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .orderBy(desc(projects.updatedAt));
    return Response.json({ ok: true, projects: rows });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Failed to list projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "Untitled Scene";
    const sceneData = body.sceneData;
    const thumbnail = typeof body.thumbnail === "string" ? body.thumbnail : null;
    if (!sceneData) {
      return Response.json({ ok: false, error: "sceneData is required" }, { status: 400 });
    }
    const id = randomUUID();
    const [row] = await db
      .insert(projects)
      .values({ id, name, sceneData, thumbnail })
      .returning({ id: projects.id, name: projects.name, updatedAt: projects.updatedAt });
    return Response.json({ ok: true, project: row });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Failed to create project" }, { status: 500 });
  }
}
