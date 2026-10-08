import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User, { USER_ROLES } from "@/models/User";
import { getSession } from "@/lib/auth/session";

// GET /api/admin/users?q=&role=&page=1&limit=20
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
    const q = (searchParams.get("q") || "").trim();
    const role = searchParams.get("role") || "";
    const active = searchParams.get("active");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20", 10));

    await connectDB();

    const filter: Record<string, unknown> = {};
    if (role && (USER_ROLES as readonly string[]).includes(role)) {
      filter.role = role;
    }
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("name email role phone preferredLocale isVerified isActive createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error("Admin list users error:", error);
    return NextResponse.json(
      { error: "Failed to list users" },
      { status: 500 }
    );
  }
}
