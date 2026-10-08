import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum([
    "draft",
    "pending",
    "approved",
    "rejected",
    "published",
    "suspended",
    "archived",
  ]),
  rejectionReason: z.string().max(1000).optional().nullable(),
});

type Params = { params: Promise<{ id: string }> };

// PATCH /api/admin/properties/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const { status, rejectionReason } = parsed.data;

    if (status === "rejected" && !rejectionReason?.trim()) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    property.status = status;

    if (status === "rejected") {
      property.rejectionReason = rejectionReason?.trim() || "";
    } else {
      property.rejectionReason = undefined;
    }

    if (status === "published") {
      property.publishedAt = new Date();
    }

    await property.save();

    return NextResponse.json({ property: property.toObject() });
  } catch (error) {
    console.error("Admin update property error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
