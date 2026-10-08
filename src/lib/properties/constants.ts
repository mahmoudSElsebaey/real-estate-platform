export const PROPERTY_TYPES = [
  "apartment", "villa", "townhouse", "penthouse", "studio", "duplex",
  "chalet", "office", "retail", "land", "hotel", "resort", "other",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_STATUS = [
  "draft", "pending", "approved", "rejected", "published", "suspended", "archived",
] as const;

export type PropertyStatus = (typeof PROPERTY_STATUS)[number];

export const LISTING_PURPOSE = ["sale", "rent", "invest", "both"] as const;
export type ListingPurpose = (typeof LISTING_PURPOSE)[number];
