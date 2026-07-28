import mongoose, { Schema } from "mongoose";
import { IOTP } from "../interfaces/otp.interface";

const OTPSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    hashedOTP: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["signup", "login"],
      required: true,
    },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    attempts: { type: Number, default: 0, max: 5 },
    metadata: {
      name: { type: String },
      phone: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const OTPModel = mongoose.model<IOTP>("OTP", OTPSchema);
