import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

const createSchema = z.object({
  propertyId: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.coerce.number().int().min(1).max(50).default(1),
  message: z.string().max(2000).optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") || "mine";
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (scope === "inbox") filter.propertyOwner = session.userId;
    else filter.user = session.userId;
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .populate("property", "title type purpose price rentalPrice currency location images status")
      .populate("user", "name email phone")
      .lean();
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("List bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
    }
    if (checkOut <= checkIn) {
      return NextResponse.json({ error: "checkOut must be after checkIn" }, { status: 400 });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkIn < today) {
      return NextResponse.json({ error: "checkIn cannot be in the past" }, { status: 400 });
    }
    await connectDB();
    const property = await Property.findById(data.propertyId);
    if (!property || property.status === "archived") {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    const nightly = property.purpose === "rent" || property.purpose === "both" ? property.rentalPrice || property.price : property.price;
    const estimatedTotal = nightly * nights;
    const booking = await Booking.create({
      property: property._id,
      propertyOwner: property.owner,
      user: session.userId,
      checkIn,
      checkOut,
      guests: data.guests,
      message: data.message || undefined,
      status: "pending",
      estimatedTotal,
      currency: property.currency || "EGP",
    });
    return NextResponse.json({ booking: booking.toObject() }, { status: 201 });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
