import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { PROPERTY_TYPES, PROPERTY_STATUS, LISTING_PURPOSE, type PropertyType, type PropertyStatus, type ListingPurpose } from "@/lib/properties/constants";

export interface IPropertyImage {
  url: string;
  publicId?: string;
  isPrimary: boolean;
  order: number;
  alt?: string;
}

export interface IProperty extends Document {
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  type: PropertyType;
  purpose: ListingPurpose;
  status: PropertyStatus;
  price: number;
  rentalPrice?: number;
  currency: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  furnishing?: "furnished" | "semi_furnished" | "unfurnished";
  amenities: string[];
  location: {
    city: string;
    district?: string;
    address?: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  images: IPropertyImage[];
  owner: Types.ObjectId;
  agent?: Types.ObjectId;
  isFeatured: boolean;
  views: number;
  rejectionReason?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PropertyImageSchema = new Schema<IPropertyImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    alt: { type: String },
  },
  { _id: false }
);

const PropertySchema = new Schema<IProperty>(
  {
    title: {
      en: { type: String, required: true, trim: true, maxlength: 200 },
      ar: { type: String, required: true, trim: true, maxlength: 200 },
    },
    description: {
      en: { type: String, required: true, maxlength: 5000 },
      ar: { type: String, required: true, maxlength: 5000 },
    },
    type: { type: String, enum: PROPERTY_TYPES, required: true },
    purpose: { type: String, enum: LISTING_PURPOSE, required: true, default: "sale" },
    status: { type: String, enum: PROPERTY_STATUS, default: "draft" },
    price: { type: Number, required: true, min: 0 },
    rentalPrice: { type: Number, min: 0 },
    currency: { type: String, default: "EGP" },
    area: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    floor: { type: Number },
    totalFloors: { type: Number },
    yearBuilt: { type: Number },
    furnishing: { type: String, enum: ["furnished", "semi_furnished", "unfurnished"] },
    amenities: [{ type: String }],
    location: {
      city: { type: String, required: true },
      district: { type: String },
      address: { type: String },
      country: { type: String, default: "Egypt" },
      coordinates: { lat: { type: Number }, lng: { type: Number } },
    },
    images: [PropertyImageSchema],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    agent: { type: Schema.Types.ObjectId, ref: "User" },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    rejectionReason: { type: String },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

PropertySchema.index({ status: 1, purpose: 1 });
PropertySchema.index({ "location.city": 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ createdAt: -1 });

const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema);

export default Property;
