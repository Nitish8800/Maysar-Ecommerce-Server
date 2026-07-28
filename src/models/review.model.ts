import mongoose, { Schema } from "mongoose";
import { IReview } from "../interfaces/review.interface";

const ReviewSchema = new Schema<IReview>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
