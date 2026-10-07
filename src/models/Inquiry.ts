import mongoose, { Schema, Document, Model, Types } from "mongoose";

export const INQUIRY_TYPES = ["info", "visit", "offer", "other"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const INQUIRY_STATUS = ["new", "in_progress", "contacted", "closed"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUS)[number];

export interface IInquiry extends Document {
  property: Types.ObjectId;
  propertyOwner: Types.ObjectId;
  user?: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  type: InquiryType;
  message: string;
  preferredDate?: Date;
  status: InquiryStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true, index: true },
    propertyOwner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    type: { type: String, enum: INQUIRY_TYPES, default: "info" },
    message: { type: String, required: true, maxlength: 2000 },
    preferredDate: { type: Date },
    status: { type: String, enum: INQUIRY_STATUS, default: "new", index: true },
    notes: { type: String, maxlength: 2000 },
  },
  { timestamps: true }
);

InquirySchema.index({ createdAt: -1 });

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;
