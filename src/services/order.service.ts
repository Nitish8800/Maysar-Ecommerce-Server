import { orderRepository } from "../repositories/order.repository";
import { cartRepository } from "../repositories/cart.repository";
import { productRepository } from "../repositories/product.repository";
import { couponRepository } from "../repositories/coupon.repository";
import { returnRepository } from "../repositories/return.repository";
import { ApiError } from "../utils/apiError.util";
import { IOrder } from "../interfaces/order.interface";
import { IAddress } from "../interfaces/user.interface";

export class OrderService {
  public async createOrder(
    customerId: string,
    shippingAddress: IAddress,
    billingAddress: IAddress,
    paymentMethod: string,
    couponCode?: string
  ): Promise<IOrder> {
    const cart = await cartRepository.findByCustomerId(customerId);
    if (!cart || cart.items.length === 0) {
      throw ApiError.badRequest("Cart is empty.");
    }

    const orderItems: any[] = [];
    let subtotal = 0;

    // Check stock & build order items
    for (const item of cart.items) {
      const product = await productRepository.findById(item.product._id ? item.product._id.toString() : item.product.toString());
      if (!product) throw ApiError.notFound(`Product not found.`);
      if (product.stock < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for product "${product.title}".`);
      }

      const packIdx = item.packIndex ?? 0;
      const pack = product.packs?.[packIdx] || product.packs?.[0];
      const variantName = item.variantName || pack?.name || (pack?.sachets ? `${pack.sachets} Sachets` : `Pack ${packIdx + 1}`);
      const sku = item.sku || pack?.sku || (pack?.sachets ? `${product.SKU}-${pack.sachets}S` : product.SKU);
      const sachets = item.sachets || pack?.sachets || 15;

      orderItems.push({
        product: product._id,
        title: product.title,
        variantName,
        sku,
        sachets,
        price: item.price,
        quantity: item.quantity,
        image: product.thumbnail || (product.images[0] ?? ""),
      });

      subtotal += item.price * item.quantity;
    }

    // Process coupon if present
    let discount = 0;
    let couponId: any = undefined;
    if (couponCode) {
      const coupon = await couponRepository.findByCode(couponCode);
      if (!coupon || coupon.status !== "active" || new Date() > new Date(coupon.expiryDate)) {
        throw ApiError.badRequest("Invalid or expired coupon.");
      }
      if (subtotal < coupon.minimumOrder) {
        throw ApiError.badRequest(`Minimum order amount of $${coupon.minimumOrder} required for coupon ${couponCode}.`);
      }

      if (coupon.discountType === "percentage") {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
          discount = coupon.maximumDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }

      coupon.usedCount += 1;
      await coupon.save();
      couponId = coupon._id;
    }

    const shipping = subtotal > 100 ? 0 : 10;
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const grandTotal = Math.max(0, subtotal + shipping + tax - discount);

    // Deduct stock
    for (const item of cart.items) {
      const pId = item.product._id ? item.product._id.toString() : item.product.toString();
      await productRepository.updateById(pId, { $inc: { stock: -item.quantity } });
    }

    // Create order
    const order = await orderRepository.create({
      customer: customerId as any,
      items: orderItems,
      shippingAddress,
      billingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      discount,
      coupon: couponId,
      grandTotal,
      orderStatus: "Pending",
      paymentStatus: "Pending",
      trackingNumber: `TRK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    // Clear cart
    cart.items = [];
    cart.grandTotal = 0;
    await cart.save();

    return order;
  }

  public async getCustomerOrders(customerId: string): Promise<IOrder[]> {
    return await orderRepository.findByCustomerId(customerId);
  }

  public async getOrderDetails(orderId: string, customerId?: string): Promise<IOrder> {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound("Order not found.");

    if (customerId && order.customer.toString() !== customerId) {
      throw ApiError.forbidden("Access denied.");
    }
    return order;
  }

  public async cancelOrder(orderId: string, customerId: string): Promise<IOrder> {
    const order = await this.getOrderDetails(orderId, customerId);

    if (["Delivered", "Cancelled", "Returned", "Shipped"].includes(order.orderStatus)) {
      throw ApiError.badRequest(`Order cannot be cancelled in status '${order.orderStatus}'.`);
    }

    order.orderStatus = "Cancelled";
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await productRepository.updateById(item.product.toString(), { $inc: { stock: item.quantity } });
    }

    return order;
  }

  public async trackOrder(orderId: string, customerId: string): Promise<{ orderStatus: string; trackingNumber?: string; updatedAt: Date }> {
    const order = await this.getOrderDetails(orderId, customerId);
    return {
      orderStatus: order.orderStatus,
      trackingNumber: order.trackingNumber,
      updatedAt: order.updatedAt,
    };
  }

  public async requestReturn(orderId: string, customerId: string, reason: string, description?: string, images: string[] = []): Promise<any> {
    const order = await this.getOrderDetails(orderId, customerId);
    if (order.orderStatus !== "Delivered") {
      throw ApiError.badRequest("Only delivered orders can be returned.");
    }

    const returnRequest = await returnRepository.create({
      order: order._id,
      customer: customerId as any,
      reason,
      description,
      images,
      status: "requested",
    });

    order.orderStatus = "Returned";
    await order.save();

    return returnRequest;
  }
}

export const orderService = new OrderService();
