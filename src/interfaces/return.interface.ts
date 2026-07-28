import { Document, Types } from "mongoose";

export interface IReturn extends Document {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  customer: Types.ObjectId;
  reason: string;
  description?: string;
  images: string[];
  status: "requested" | "approved" | "rejected" | "completed";
  createdAt: Date;
  updatedAt: Date;
}
