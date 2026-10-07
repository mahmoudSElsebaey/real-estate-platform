import mongoose, { Schema, Document, Model, Types } from "mongoose";

export const BOOKING_STATUS = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
] as const;
export type BookingStatus = (typeof BOOKING_STATUS)[number];

export interface IBooking extends Document {
  property: Types.ObjectId;
  propertyOwner: Types.ObjectId;
  user: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  message?: string;
  status: BookingStatus;
  estimatedTotal?: number;
  currency: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    propertyOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1, max: 50, default: 1 },
    message: { type: String, maxlength: 2000 },
    status: {
      type: String,
      enum: BOOKING_STATUS,
      default: "pending",
      index: true,
    },
    estimatedTotal: { type: Number, min: 0 },
    currency: { type: String, default: "EGP" },
    notes: { type: String, maxlength: 2000 },
  },
  { timestamps: true }
);

BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ propertyOwner: 1, createdAt: -1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
