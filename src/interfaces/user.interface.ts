import { Document, Types } from "mongoose";

export interface IAddress {
  _id?: Types.ObjectId | string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface IPaymentMethod {
  _id?: Types.ObjectId | string;
  provider: string;
  accountNumberOrLast4: string;
  isDefault?: boolean;
}

export interface INotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  orderUpdates: boolean;
  promotional: boolean;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "customer" | "admin";
  isVerified: boolean;
  status: "active" | "blocked";
  wishlist: Types.ObjectId[];
  cart: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  addresses: IAddress[];
  paymentMethods: IPaymentMethod[];
  notificationPreferences: INotificationPreferences;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
