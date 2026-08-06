import crypto from "crypto";
import { paymentRepository } from "../repositories/payment.repository";
import { orderRepository } from "../repositories/order.repository";
import { cartRepository } from "../repositories/cart.repository";
import { ApiError } from "../utils/apiError.util";
import { IPayment } from "../interfaces/payment.interface";
import { razorpayInstance } from "../config/razorpay.config";
import { env } from "../config/env.config";

export class PaymentService {
  public async processPayment(
    customerId: string,
    orderId: string,
    paymentGateway: string,
    amount: number,
    transactionId: string
  ): Promise<IPayment> {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound("Order not found.");

    const payment = await paymentRepository.create({
      customer: customerId as any,
      order: order._id,
      transactionId,
      paymentGateway,
      currency: "INR",
      amount,
      status: "completed",
      paidAt: new Date(),
    });

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    await order.save();

    return payment;
  }

  public async getPayments(customerId?: string): Promise<IPayment[]> {
    const filter = customerId ? { customer: customerId } : {};
    return await paymentRepository.find(filter);
  }

  public async createRazorpayOrder(customerId: string, orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw ApiError.notFound("Order not found.");
    }

    if (order.customer.toString() !== customerId) {
      throw ApiError.forbidden("Unauthorized access to this order.");
    }

    const amountInPaise = Math.round(order.grandTotal * 100);

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_rcptid_${order._id}`,
      notes: {
        orderId: order._id.toString(),
        customerId,
      },
    });

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: env.RAZORPAY_KEY_ID,
    };
  }

  public async verifyRazorpayPayment(
    customerId: string,
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw ApiError.notFound("Order not found.");
    }

    const generatedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET || "placeholder_secret")
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      order.paymentStatus = "Failed";
      await order.save();
      throw ApiError.badRequest("Invalid Razorpay payment signature.");
    }

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    await order.save();

    const payment = await paymentRepository.create({
      customer: customerId as any,
      order: order._id,
      transactionId: razorpayPaymentId,
      paymentGateway: "Razorpay",
      currency: "INR",
      amount: order.grandTotal,
      status: "completed",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paidAt: new Date(),
    });

    // Clear customer cart in DB on successful payment verification
    const cart = await cartRepository.findByCustomerId(customerId);
    if (cart) {
      cart.items = [];
      cart.grandTotal = 0;
      await cart.save();
    }

    return {
      success: true,
      message: "Payment verified successfully.",
      payment,
      order,
    };
  }

  public getRazorpayKey() {
    return { keyId: env.RAZORPAY_KEY_ID };
  }
}

export const paymentService = new PaymentService();
