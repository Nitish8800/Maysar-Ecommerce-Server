import { BaseRepository } from "./base.repository";
import { INotification } from "../interfaces/notification.interface";
import { NotificationModel } from "../models/notification.model";

export class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super(NotificationModel);
  }

  async findByUserId(userId: string): Promise<INotification[]> {
    return await this.model.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }
}

export const notificationRepository = new NotificationRepository();
