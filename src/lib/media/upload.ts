import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export interface UploadedImage {
  url: string;
  publicId?: string;
}

function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Invalid file type. Use JPEG, PNG, WebP, or GIF.";
  }
  if (file.size > MAX_BYTES) {
    return "File too large. Maximum size is 5MB.";
  }
  return null;
}

async function uploadToCloudinary(file: File): Promise<UploadedImage> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  const key = process.env.CLOUDINARY_API_KEY!;
  const secret = process.env.CLOUDINARY_API_SECRET!;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "aqarco";
  const crypto = await import("crypto");
  const toSign = `folder=${folder}&timestamp=${timestamp}${secret}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  const form = new FormData();
  form.append("file", base64);
  form.append("api_key", key);
  form.append("timestamp", timestamp);
  form.append("signature", signature);
  form.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Cloudinary upload failed:", err);
    throw new Error("Cloudinary upload failed");
  }

  const data = (await res.json()) as {
    secure_url: string;
    public_id: string;
  };

  return { url: data.secure_url, publicId: data.public_id };
}

async function uploadLocal(file: File, userId: string): Promise<UploadedImage> {
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";

  const dir = path.join(process.cwd(), "public", "uploads", userId);
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}.${ext}`;
  const fullPath = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);

  return { url: `/uploads/${userId}/${filename}` };
}

export async function uploadImageFile(
  file: File,
  userId: string
): Promise<UploadedImage> {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  if (cloudinaryConfigured()) {
    return uploadToCloudinary(file);
  }

  return uploadLocal(file, userId);
}

export { cloudinaryConfigured };
