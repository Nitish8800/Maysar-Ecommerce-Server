import { Document, Types } from "mongoose";

export interface IReview extends Document {
  _id: Types.ObjectId;
  customer: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  comment: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
