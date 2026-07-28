import { Document, Types } from "mongoose";

export interface IOTPMetadata {
  name?: string;
  phone?: string;
}

export interface IOTP extends Document {
  _id: Types.ObjectId;
  email: string;
  hashedOTP: string;
  purpose: "signup" | "login";
  expiresAt: Date;
  attempts: number;
  metadata?: IOTPMetadata;
  createdAt: Date;
}
