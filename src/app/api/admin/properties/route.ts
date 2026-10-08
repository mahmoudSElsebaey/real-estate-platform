import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Property, { PROPERTY_STATUS } from "@/models/Property";
import { getSession } from "@/lib/auth/session";

// GET /api/admin/properties?status=pending&page=1
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20", 10));
    const q = searchParams.get("q") || "";

    await connectDB();

    const filter: Record<string, unknown> = {};
    if (status && (PROPERTY_STATUS as readonly string[]).includes(status)) {
      filter.status = status;
    }
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
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("owner", "name email phone role")
        .lean(),
      Property.countDocuments(filter),
    ]);

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error("Admin list properties error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
