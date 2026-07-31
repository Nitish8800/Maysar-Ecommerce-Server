import { Document, Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  packIndex?: number;
  variantName?: string;
  sku?: string;
  sachets?: number;
  price: number;
  subtotal: number;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  customer: Types.ObjectId;
  items: ICartItem[];
  grandTotal: number;
  createdAt: Date;
  updatedAt: Date;
}
