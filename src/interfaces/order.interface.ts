import { Document, Types } from "mongoose";
import { IAddress } from "./user.interface";

export interface IOrderItem {
  product: Types.ObjectId;
  title: string;
  variantName?: string;
  sku?: string;
  sachets?: number;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  customer: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress: IAddress;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  coupon?: Types.ObjectId | string;
  grandTotal: number;
  orderStatus: "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Returned";
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
