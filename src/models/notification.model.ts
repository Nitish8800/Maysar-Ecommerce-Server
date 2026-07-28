import mongoose, { Schema } from "mongoose";
import { INotification } from "../interfaces/notification.interface";

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, default: "system" },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);
