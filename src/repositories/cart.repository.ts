import { BaseRepository } from "./base.repository";
import { ICart } from "../interfaces/cart.interface";
import { CartModel } from "../models/cart.model";

export class CartRepository extends BaseRepository<ICart> {
  constructor() {
    super(CartModel);
  }

  async findByCustomerId(customerId: string): Promise<ICart | null> {
    return await this.model.findOne({ customer: customerId }).populate("items.product").exec();
  }
}

export const cartRepository = new CartRepository();
