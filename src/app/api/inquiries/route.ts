import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import Property from "@/models/Property";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

const createInquirySchema = z.object({
  propertyId: z.string().min(1),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
  type: z.enum(["info", "visit", "offer", "other"]).default("info"),
  message: z.string().min(5).max(2000),
  preferredDate: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") || "sent";
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (scope === "inbox") filter.propertyOwner = session.userId;
    else filter.user = session.userId;
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .populate("property", "title type price currency location images status")
      .populate("user", "name email")
      .lean();
    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("List inquiries error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createInquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    await connectDB();
    const property = await Property.findById(data.propertyId);
    if (!property || property.status === "archived") {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    const session = await getSession();
    const inquiry = await Inquiry.create({
      property: property._id,
      propertyOwner: property.owner,
      user: session?.userId || undefined,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      type: data.type,
      message: data.message,
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : undefined,
      status: "new",
    });
    return NextResponse.json({ inquiry: inquiry.toObject() }, { status: 201 });
  } catch (error) {
    console.error("Create inquiry error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
