import mongoose from "mongoose";
import { BaseRepository } from "./base.repository";
import { IOrder } from "../interfaces/order.interface";
import { OrderModel } from "../models/order.model";
import { UserModel } from "../models/user.model";

export class OrderRepository extends BaseRepository<IOrder> {
  constructor() {
    super(OrderModel);
  }

  async findByCustomerId(customerId: string): Promise<IOrder[]> {
    return await this.model.find({ customer: customerId }).sort({ createdAt: -1 }).exec();
  }

  async paginateWithCustomer(
    filter: any = {},
    page: number = 1,
    limit: number = 100,
    search?: string,
    sort: any = { createdAt: -1 }
  ) {
    let queryFilter: any = { ...filter };

    if (search && search.trim()) {
      const q = search.trim();
      const regex = new RegExp(q, "i");

      // Find matching customer user IDs
      const matchingUsers = await UserModel.find({
        $or: [
          { name: regex },
          { email: regex },
          { phone: regex },
        ],
      }).select("_id");

      const matchingUserIds = matchingUsers.map((u) => u._id);

      const searchConditions: any[] = [
        { trackingNumber: regex },
        { paymentMethod: regex },
        { orderStatus: regex },
        { "items.title": regex },
        { "items.variantName": regex },
        { "items.sku": regex },
        { "shippingAddress.firstName": regex },
        { "shippingAddress.lastName": regex },
        { "shippingAddress.phone": regex },
        { "shippingAddress.city": regex },
      ];

      if (matchingUserIds.length > 0) {
        searchConditions.push({ customer: { $in: matchingUserIds } });
      }

      if (mongoose.Types.ObjectId.isValid(q)) {
        searchConditions.push({ _id: new mongoose.Types.ObjectId(q) });
      }

      queryFilter.$or = searchConditions;
    }

    const skip = (page - 1) * limit;
    const total = await this.count(queryFilter);
    const data = await this.model
      .find(queryFilter)
      .populate("customer", "name email role phone avatar")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    const totalPages = Math.ceil(total / limit) || 1;
    return { data, total, page, totalPages };
  }
}

export const orderRepository = new OrderRepository();
