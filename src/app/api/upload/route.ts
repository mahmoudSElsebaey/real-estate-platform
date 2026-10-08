import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { uploadImageFile, validateImageFile } from "@/lib/media/upload";
import {
  rateLimit,
  clientIp,
  rateLimitResponse,
} from "@/lib/auth/rate-limit";

// POST /api/upload — multipart form field "file"
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip = clientIp(req);
    const rl = rateLimit(`upload:${session.userId}:${ip}`, 30, 60 * 60 * 1000); // 30/hour
    if (!rl.success) return rateLimitResponse(rl.resetAt);

    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const result = await uploadImageFile(file, session.userId);

    return NextResponse.json(
      {
        url: result.url,
        publicId: result.publicId || null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
