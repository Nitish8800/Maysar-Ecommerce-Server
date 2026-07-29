import { Document, Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  brand: string;
  category: Types.ObjectId;
  price: number;
  salePrice?: number;
  discount?: number;
  SKU: string;
  barcode?: string;
  stock: number;
  images: string[];
  thumbnail: string;
  ratings: number;
  reviewsCount: number;
  tags: string[];
  status: "active" | "draft" | "archived";
  featured: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
