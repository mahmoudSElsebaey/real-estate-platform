import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IFavorite extends Document {
  user: Types.ObjectId;
  property: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

FavoriteSchema.index({ user: 1, property: 1 }, { unique: true });

const Favorite: Model<IFavorite> =
  mongoose.models.Favorite ||
  mongoose.model<IFavorite>("Favorite", FavoriteSchema);

export default Favorite;
