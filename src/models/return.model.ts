import mongoose, { Schema } from "mongoose";
import { IReturn } from "../interfaces/return.interface";

const ReturnSchema = new Schema<IReturn>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    reason: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "completed"],
      default: "requested",
    },
  },
  { timestamps: true }
);

export const ReturnModel = mongoose.model<IReturn>("Return", ReturnSchema);
