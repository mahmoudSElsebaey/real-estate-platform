import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User, { USER_ROLES } from "@/models/User";
import { getSession } from "@/lib/auth/session";

// PATCH /api/admin/users/:id — update role / isActive
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));

    if (id === session.userId) {
      if (body.isActive === false) {
        return NextResponse.json(
          { error: "You cannot deactivate your own account" },
          { status: 400 }
        );
      }
      if (body.role && body.role !== "admin") {
        return NextResponse.json(
          { error: "You cannot remove your own admin role" },
          { status: 400 }
        );
      }
    }

    const updates: Record<string, unknown> = {};

    if (typeof body.role === "string") {
      if (!(USER_ROLES as readonly string[]).includes(body.role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      updates.role = body.role;
    }
    if (typeof body.isActive === "boolean") {
      updates.isActive = body.isActive;
    }
    if (typeof body.isVerified === "boolean") {
      updates.isVerified = body.isVerified;
    }
    if (typeof body.name === "string" && body.name.trim().length >= 2) {
      updates.name = body.name.trim();
    }
    if (typeof body.phone === "string") {
      updates.phone = body.phone.trim() || undefined;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("name email role phone preferredLocale isVerified isActive createdAt");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Admin update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/:id — soft-delete (deactivate)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    if (id === session.userId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select("name email role isActive");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user, message: "User deactivated" });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { error: "Failed to deactivate user" },
      { status: 500 }
    );
  }
}
