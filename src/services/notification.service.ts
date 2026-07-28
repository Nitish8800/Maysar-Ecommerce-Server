import { notificationRepository } from "../repositories/notification.repository";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/apiError.util";
import { INotification } from "../interfaces/notification.interface";

export class NotificationService {
  public async getUserNotifications(userId: string): Promise<INotification[]> {
    return await notificationRepository.findByUserId(userId);
  }

  public async markAsRead(notificationId: string, userId: string): Promise<INotification> {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification) throw ApiError.notFound("Notification not found.");
    if (notification.user.toString() !== userId) throw ApiError.forbidden("Access denied.");

    notification.isRead = true;
    await notification.save();
    return notification;
  }

  public async sendNotification(userId: string, title: string, message: string, type: string = "system"): Promise<INotification> {
    return await notificationRepository.create({
      user: userId as any,
      title,
      message,
      type,
      isRead: false,
    });
  }

  public async broadcastNotification(title: string, message: string, type: string = "broadcast"): Promise<{ sentCount: number }> {
    const users = await userRepository.find({ status: "active" });
    const notifications = users.map((u) => ({
      user: u._id,
      title,
      message,
      type,
      isRead: false,
    }));

    if (notifications.length > 0) {
      await notificationRepository.find({}, {}); // triggers connection check
      // Bulk insert
      for (const n of notifications) {
        await notificationRepository.create(n);
      }
    }
    return { sentCount: users.length };
  }
}

export const notificationService = new NotificationService();
