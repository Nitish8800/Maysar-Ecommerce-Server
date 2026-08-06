import { Document, Types } from "mongoose";

export interface IPayment extends Document {
  _id: Types.ObjectId;
  customer: Types.ObjectId;
  order: Types.ObjectId;
  transactionId: string;
  paymentGateway: string;
  currency: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
