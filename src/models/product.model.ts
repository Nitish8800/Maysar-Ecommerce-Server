import mongoose, { Schema } from "mongoose";
import { IProduct } from "../interfaces/product.interface";

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    brand: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    discount: { type: Number, default: 0 },
    SKU: { type: String, required: true, unique: true, uppercase: true, trim: true },
    barcode: { type: String, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: [{ type: String }],
    thumbnail: { type: String, required: true },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    tags: [{ type: String, trim: true }],
    status: { type: String, enum: ["active", "draft", "archived"], default: "active" },
    featured: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", description: "text", brand: "text", tags: "text" });

export const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);
