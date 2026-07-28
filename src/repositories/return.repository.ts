import { BaseRepository } from "./base.repository";
import { IReturn } from "../interfaces/return.interface";
import { ReturnModel } from "../models/return.model";

export class ReturnRepository extends BaseRepository<IReturn> {
  constructor() {
    super(ReturnModel);
  }

  async findByCustomerId(customerId: string): Promise<IReturn[]> {
    return await this.model.find({ customer: customerId }).sort({ createdAt: -1 }).exec();
  }
}

export const returnRepository = new ReturnRepository();
