import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(24, parseInt(searchParams.get("limit") || "12", 10));
    const city = searchParams.get("city") || "";
    const q = searchParams.get("q") || "";

    await connectDB();
    const filter: Record<string, unknown> = {
      status: "published",
      purpose: { $in: ["invest", "both"] },
    };
    if (city) filter["location.city"] = { $regex: city, $options: "i" };
    if (q) {
      filter.$or = [
        { "title.en": { $regex: q, $options: "i" } },
        { "title.ar": { $regex: q, $options: "i" } },
        { "location.city": { $regex: q, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
      Property.find(filter)
        .sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("title type purpose price currency area location images isFeatured publishedAt")
        .lean(),
      Property.countDocuments(filter),
    ]);

    return NextResponse.json({
      opportunities: properties,
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (error) {
    console.error("List investments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
