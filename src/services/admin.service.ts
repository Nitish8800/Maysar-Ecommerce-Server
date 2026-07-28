import { userRepository } from "../repositories/user.repository";
import { productRepository } from "../repositories/product.repository";
import { orderRepository } from "../repositories/order.repository";
import { categoryRepository } from "../repositories/category.repository";
import { ApiError } from "../utils/apiError.util";
import { IUser } from "../interfaces/user.interface";
import { IOrder } from "../interfaces/order.interface";

export class AdminService {
  public async getDashboardStats(): Promise<any> {
    const totalCustomers = await userRepository.count({ role: "customer" });
    const totalProducts = await userRepository.count({}); // just query
    const prodCount = await productRepository.count({});
    const totalOrders = await orderRepository.count({});
    const pendingOrders = await orderRepository.count({ orderStatus: "Pending" });

    const completedOrders = await orderRepository.find({ paymentStatus: "Paid" });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.grandTotal, 0);

    const recentOrders = await orderRepository.find({}, { limit: 5, sort: { createdAt: -1 } });

    return {
      totalCustomers,
      totalProducts: prodCount,
      totalOrders,
      pendingOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      recentOrders,
    };
  }

  public async getCustomers(page: number = 1, limit: number = 10): Promise<any> {
    return await userRepository.paginate({ role: "customer" }, page, limit);
  }

  public async updateCustomerStatus(customerId: string, status: "active" | "blocked"): Promise<IUser> {
    const user = await userRepository.updateById(customerId, { status });
    if (!user) throw ApiError.notFound("Customer not found.");
    return user;
  }

  public async updateInventory(productId: string, stock: number): Promise<any> {
    const product = await productRepository.updateById(productId, { stock });
    if (!product) throw ApiError.notFound("Product not found.");
    return product;
  }

  public async updateOrderStatus(orderId: string, orderStatus: string, trackingNumber?: string): Promise<IOrder> {
    const updateData: any = { orderStatus };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const order = await orderRepository.updateById(orderId, updateData);
    if (!order) throw ApiError.notFound("Order not found.");
    return order;
  }

  public async getReports(): Promise<any> {
    const orders = await orderRepository.find({});
    const salesByStatus: Record<string, number> = {};

    orders.forEach((o) => {
      salesByStatus[o.orderStatus] = (salesByStatus[o.orderStatus] || 0) + 1;
    });

    return {
      totalOrders: orders.length,
      salesByStatus,
      totalRevenue: orders
        .filter((o) => o.paymentStatus === "Paid")
        .reduce((sum, o) => sum + o.grandTotal, 0),
    };
  }
}

export const adminService = new AdminService();
