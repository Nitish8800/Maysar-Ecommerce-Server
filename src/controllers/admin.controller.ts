import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import { notificationService } from "../services/notification.service";
import { sendSuccess } from "../utils/apiResponse.util";
import { asyncHandler } from "../helpers/asyncHandler.helper";

export class AdminController {
  public getDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, "Admin dashboard stats retrieved.", stats);
  });

  public getCustomers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const role = req.query.role as string;
    const search = req.query.search as string;
    const customers = await adminService.getCustomers(page, limit, role, search);
    sendSuccess(res, "Customers list retrieved.", customers.data, {
      total: customers.total,
      page: customers.page,
      totalPages: customers.totalPages,
    });
  });

  public updateUserRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { role } = req.body;
    const user = await adminService.updateUserRole(req.params.id, role);
    sendSuccess(res, `User role updated to ${role}.`, user);
  });

  public updateCustomerStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body;
    const customer = await adminService.updateCustomerStatus(req.params.id, status);
    sendSuccess(res, `Customer status updated to ${status}.`, customer);
  });

  public getOrders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const status = req.query.status as string;
    const search = req.query.search as string;
    const orders = await adminService.getAllOrders(page, limit, status, search);
    sendSuccess(res, "Admin orders list retrieved.", orders.data, {
      total: orders.total,
      page: orders.page,
      totalPages: orders.totalPages,
    });
  });

  public updateInventory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { stock } = req.body;
    const product = await adminService.updateInventory(req.params.productId, Number(stock));
    sendSuccess(res, "Inventory updated.", product);
  });

  public updateOrderStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { orderStatus, trackingNumber } = req.body;
    const order = await adminService.updateOrderStatus(req.params.id, orderStatus, trackingNumber);
    sendSuccess(res, "Order status updated.", order);
  });

  public getReports = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const reports = await adminService.getReports();
    sendSuccess(res, "Reports generated.", reports);
  });

  public broadcastNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { title, message, type } = req.body;
    const result = await notificationService.broadcastNotification(title, message, type);
    sendSuccess(res, `Notification broadcasted to ${result.sentCount} active users.`, result);
  });

  public getSettings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const settings = {
      appName: "Maysar",
      currency: "USD",
      freeShippingThreshold: 100,
      taxRatePercentage: 5,
    };
    sendSuccess(res, "Settings fetched.", settings);
  });

  public updateSettings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, "Settings updated successfully.", req.body);
  });
}

export const adminController = new AdminController();
