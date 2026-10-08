import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

const updateSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "cancelled", "completed"])
    .optional(),
  notes: z.string().max(2000).optional().nullable(),
});

type Params = { params: Promise<{ id: string }> };

// PATCH /api/bookings/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const isOwner = booking.propertyOwner.toString() === session.userId;
    const isGuest = booking.user.toString() === session.userId;
    const isAdmin = session.role === "admin";

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (isGuest && !isOwner && !isAdmin) {
      if (parsed.data.status && parsed.data.status !== "cancelled") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (booking.status !== "pending" && parsed.data.status === "cancelled") {
        return NextResponse.json(
          { error: "Only pending bookings can be cancelled by guest" },
          { status: 400 }
        );
      }
    } else if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (parsed.data.status) booking.status = parsed.data.status;
    if (parsed.data.notes !== undefined) {
      booking.notes = parsed.data.notes || undefined;
    }
    await booking.save();

    return NextResponse.json({ booking: booking.toObject() });
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
