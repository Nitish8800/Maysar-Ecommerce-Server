import mongoose, { Schema } from "mongoose";
import { ICart } from "../interfaces/cart.interface";

const CartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    items: [CartItemSchema],
    grandTotal: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const CartModel = mongoose.model<ICart>("Cart", CartSchema);
