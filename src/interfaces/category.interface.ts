import { Document, Types } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}
