import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const [row] = await db.select().from(projects).where(eq(projects.id, id));
    if (!row) return Response.json({ ok: false, error: "Not found" }, { status: 404 });
    return Response.json({ ok: true, project: row });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Failed to load project" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof body.name === "string" && body.name.trim()) patch.name = body.name.trim();
    if (body.sceneData) patch.sceneData = body.sceneData;
    if (typeof body.thumbnail === "string") patch.thumbnail = body.thumbnail;

    const [row] = await db
      .update(projects)
      .set(patch)
      .where(eq(projects.id, id))
      .returning({ id: projects.id, name: projects.name, updatedAt: projects.updatedAt });

    if (!row) return Response.json({ ok: false, error: "Not found" }, { status: 404 });
    return Response.json({ ok: true, project: row });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    await db.delete(projects).where(eq(projects.id, id));
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "Failed to delete project" }, { status: 500 });
  }
}
