import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { registerSchema, PUBLIC_REGISTER_ROLES } from "@/lib/auth/schemas";
import {
  rateLimit,
  clientIp,
  rateLimitResponse,
} from "@/lib/auth/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit("register:" + ip, 5, 15 * 60 * 1000);
    if (!rl.success) return rateLimitResponse(rl.resetAt);

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    let role: string = parsed.data.role || "buyer";
    if (!(PUBLIC_REGISTER_ROLES as readonly string[]).includes(role)) {
      role = "buyer";
    }

    const { name, email, password, preferredLocale } = parsed.data;

    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      preferredLocale: preferredLocale || "en",
    });

    await createSession({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          preferredLocale: user.preferredLocale,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
