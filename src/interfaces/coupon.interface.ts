import { Document, Types } from "mongoose";

export interface ICoupon extends Document {
  _id: Types.ObjectId;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrder: number;
  maximumDiscount?: number;
  expiryDate: Date;
  usageLimit: number;
  usedCount: number;
  status: "active" | "inactive" | "expired";
  createdAt: Date;
  updatedAt: Date;
}
