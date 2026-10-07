import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import Property from "@/models/Property";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const favorites = await Favorite.find({ user: session.userId })
      .sort({ createdAt: -1 })
      .populate({ path: "property", match: { status: { $ne: "archived" } } })
      .lean();
    const properties = favorites.filter((f) => f.property).map((f) => f.property);
    return NextResponse.json({ favorites: properties, count: properties.length });
  } catch (error) {
    console.error("List favorites error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const propertyId = body.propertyId;
    if (!propertyId) return NextResponse.json({ error: "propertyId is required" }, { status: 400 });
    await connectDB();
    const property = await Property.findById(propertyId);
    if (!property || property.status === "archived") {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    const favorite = await Favorite.findOneAndUpdate(
      { user: session.userId, property: propertyId },
      { user: session.userId, property: propertyId },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true, favoriteId: favorite._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("Add favorite error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
