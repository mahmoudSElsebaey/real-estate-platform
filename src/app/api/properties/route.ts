import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { getSession } from "@/lib/auth/session";
import { createPropertySchema } from "@/lib/properties/schemas";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const mine = searchParams.get("mine") === "true";
    const status = searchParams.get("status");
    const purpose = searchParams.get("purpose");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "12", 10));
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (mine) {
      if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      filter.owner = session.userId;
      if (status) filter.status = status;
    } else {
      filter.status = "published";
      if (purpose) filter.purpose = purpose;
    }
    const [properties, total] = await Promise.all([
      Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("owner", "name email").lean(),
      Property.countDocuments(filter),
    ]);
    return NextResponse.json({
      properties,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("List properties error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const allowedRoles = ["owner", "agent", "hotel_operator", "admin"];
    if (!allowedRoles.includes(session.role)) {
      return NextResponse.json({ error: "You do not have permission to create listings" }, { status: 403 });
    }
    const body = await req.json();
    const parsed = createPropertySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }
    await connectDB();
    const data = parsed.data;
    if (data.images && data.images.length > 0) {
      const hasPrimary = data.images.some((img) => img.isPrimary);
      if (!hasPrimary) data.images[0].isPrimary = true;
    }
    const property = await Property.create({ ...data, owner: session.userId, status: data.status || "draft" });
    return NextResponse.json({ property: property.toObject() }, { status: 201 });
  } catch (error) {
    console.error("Create property error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
