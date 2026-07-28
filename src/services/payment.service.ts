import { paymentRepository } from "../repositories/payment.repository";
import { orderRepository } from "../repositories/order.repository";
import { ApiError } from "../utils/apiError.util";
import { IPayment } from "../interfaces/payment.interface";

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
      currency: "USD",
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
}

export const paymentService = new PaymentService();
