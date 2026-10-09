import { z } from "zod";
import { PROPERTY_TYPES, PROPERTY_STATUS, LISTING_PURPOSE } from "@/lib/properties/constants";

export const propertyImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  publicId: z.string().optional(),
  isPrimary: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  alt: z.string().optional(),
});

export const createPropertySchema = z.object({
  title: z.object({
    en: z.string().min(5).max(200),
    ar: z.string().min(5).max(200),
  }),
  description: z.object({
    en: z.string().min(20).max(5000),
    ar: z.string().min(20).max(5000),
  }),
  type: z.enum(PROPERTY_TYPES),
  purpose: z.enum(LISTING_PURPOSE),
  price: z.number().min(0),
  rentalPrice: z.number().min(0).optional().nullable(),
  currency: z.string().default("EGP"),
  area: z.number().min(1),
  bedrooms: z.number().int().min(0).optional().nullable(),
  bathrooms: z.number().int().min(0).optional().nullable(),
  floor: z.number().int().optional().nullable(),
  totalFloors: z.number().int().optional().nullable(),
  yearBuilt: z.number().int().min(1900).max(new Date().getFullYear() + 5).optional().nullable(),
  furnishing: z.enum(["furnished", "semi_furnished", "unfurnished"]).optional().nullable(),
  amenities: z.array(z.string()).default([]),
  location: z.object({
    city: z.string().min(2),
    district: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    country: z.string().default("Egypt"),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional().nullable(),
  }),
  images: z.array(propertyImageSchema).default([]),
  status: z.enum(["draft", "pending"]).default("draft"),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  status: z.enum(PROPERTY_STATUS).optional(),
  isFeatured: z.boolean().optional(),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
