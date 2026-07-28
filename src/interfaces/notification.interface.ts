import { Document, Types } from "mongoose";

export interface INotification extends Document {
  _id: Types.ObjectId;
  title: string;
  message: string;
  type: string;
  user: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}
