import { BaseRepository } from "./base.repository";
import { IOrder } from "../interfaces/order.interface";
import { OrderModel } from "../models/order.model";

export class OrderRepository extends BaseRepository<IOrder> {
  constructor() {
    super(OrderModel);
  }

  async findByCustomerId(customerId: string): Promise<IOrder[]> {
    return await this.model.find({ customer: customerId }).sort({ createdAt: -1 }).exec();
  }
}

export const orderRepository = new OrderRepository();
