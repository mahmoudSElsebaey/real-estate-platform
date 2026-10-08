import { z } from "zod";
import { USER_ROLES } from "@/models/User";

/** Roles that can self-register via the public API. Admin is seed-only. */
export const PUBLIC_REGISTER_ROLES = [
  "buyer",
  "renter",
  "investor",
  "owner",
  "agent",
  "hotel_operator",
] as const;

export type PublicRegisterRole = (typeof PUBLIC_REGISTER_ROLES)[number];

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(PUBLIC_REGISTER_ROLES).default("buyer"),
  preferredLocale: z.enum(["en", "ar"]).default("en"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().max(20).optional().nullable(),
  preferredLocale: z.enum(["en", "ar"]).optional(),
  avatar: z.string().url().optional().nullable(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Re-export for convenience
export { USER_ROLES };
