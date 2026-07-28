import mongoose, { Schema } from "mongoose";
import { IPayment } from "../interfaces/payment.interface";

const PaymentSchema = new Schema<IPayment>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    transactionId: { type: String, required: true, unique: true },
    paymentGateway: { type: String, required: true },
    currency: { type: String, default: "USD" },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
