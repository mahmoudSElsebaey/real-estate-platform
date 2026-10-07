import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["new", "in_progress", "contacted", "closed"]).optional(),
  notes: z.string().max(2000).optional().nullable(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await connectDB();
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    const isOwner = inquiry.propertyOwner.toString() === session.userId;
    const isAdmin = session.role === "admin";
    if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }
    if (parsed.data.status) inquiry.status = parsed.data.status;
    if (parsed.data.notes !== undefined) inquiry.notes = parsed.data.notes || undefined;
    await inquiry.save();
    return NextResponse.json({ inquiry: inquiry.toObject() });
  } catch (error) {
    console.error("Update inquiry error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
