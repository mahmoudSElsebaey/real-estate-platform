import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { getSession } from "@/lib/auth/session";
import { updatePropertySchema } from "@/lib/properties/schemas";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await connectDB();
    const property = await Property.findById(id).populate("owner", "name email phone").lean();
    if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });
    const session = await getSession();
    const isOwner = session && property.owner && (property.owner as any)._id?.toString() === session.userId;
    if (property.status !== "published" && !isOwner && session?.role !== "admin") {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    if (property.status === "published") {
      await Property.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }
    return NextResponse.json({ property });
  } catch (error) {
    console.error("Get property error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await connectDB();
    const property = await Property.findById(id);
    if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });
    const isOwner = property.owner.toString() === session.userId;
    const isAdmin = session.role === "admin";
    if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json();
    const parsed = updatePropertySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }
    const updates = parsed.data;
    if (updates.status && !isAdmin) {
      const allowedForOwner = ["draft", "pending", "archived"];
      if (!allowedForOwner.includes(updates.status)) {
        return NextResponse.json({ error: "You cannot set this status" }, { status: 403 });
      }
    }
    if (updates.status === "published" && property.status !== "published") {
      (updates as any).publishedAt = new Date();
    }
    Object.assign(property, updates);
    await property.save();
    return NextResponse.json({ property: property.toObject() });
  } catch (error) {
    console.error("Update property error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await connectDB();
    const property = await Property.findById(id);
    if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });
    const isOwner = property.owner.toString() === session.userId;
    const isAdmin = session.role === "admin";
    if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    property.status = "archived";
    await property.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete property error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
