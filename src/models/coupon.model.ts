import mongoose, { Schema } from "mongoose";
import { ICoupon } from "../interfaces/coupon.interface";

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minimumOrder: { type: Number, default: 0, min: 0 },
    maximumDiscount: { type: Number },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive", "expired"], default: "active" },
  },
  { timestamps: true }
);

export const CouponModel = mongoose.model<ICoupon>("Coupon", CouponSchema);
