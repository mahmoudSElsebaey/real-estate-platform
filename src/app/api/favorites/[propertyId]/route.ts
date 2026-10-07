import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import { getSession } from "@/lib/auth/session";

type Params = { params: Promise<{ propertyId: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { propertyId } = await params;
    await connectDB();
    const result = await Favorite.findOneAndDelete({ user: session.userId, property: propertyId });
    if (!result) return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove favorite error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ favorited: false });
    const { propertyId } = await params;
    await connectDB();
    const exists = await Favorite.exists({ user: session.userId, property: propertyId });
    return NextResponse.json({ favorited: !!exists });
  } catch (error) {
    console.error("Check favorite error:", error);
    return NextResponse.json({ favorited: false });
  }
}
