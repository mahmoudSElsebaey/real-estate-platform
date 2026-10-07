import mongoose, { Schema, Document, Model, Types } from "mongoose";

export const INTEREST_STATUS = ["new", "contacted", "closed"] as const;
export type InterestStatus = (typeof INTEREST_STATUS)[number];

export interface IInvestmentInterest extends Document {
  property: Types.ObjectId;
  propertyOwner: Types.ObjectId;
  user: Types.ObjectId;
  proposedAmount?: number;
  message?: string;
  status: InterestStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentInterestSchema = new Schema<IInvestmentInterest>(
  {
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true, index: true },
    propertyOwner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    proposedAmount: { type: Number, min: 0 },
    message: { type: String, maxlength: 2000 },
    status: { type: String, enum: INTEREST_STATUS, default: "new", index: true },
    notes: { type: String, maxlength: 2000 },
  },
  { timestamps: true }
);

InvestmentInterestSchema.index({ createdAt: -1 });
InvestmentInterestSchema.index({ user: 1, createdAt: -1 });
InvestmentInterestSchema.index({ propertyOwner: 1, createdAt: -1 });

const InvestmentInterest: Model<IInvestmentInterest> =
  mongoose.models.InvestmentInterest ||
  mongoose.model<IInvestmentInterest>("InvestmentInterest", InvestmentInterestSchema);

export default InvestmentInterest;
