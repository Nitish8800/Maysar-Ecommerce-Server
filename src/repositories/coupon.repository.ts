import { BaseRepository } from "./base.repository";
import { ICoupon } from "../interfaces/coupon.interface";
import { CouponModel } from "../models/coupon.model";

export class CouponRepository extends BaseRepository<ICoupon> {
  constructor() {
    super(CouponModel);
  }

  async findByCode(code: string): Promise<ICoupon | null> {
    return await this.findOne({ code: code.toUpperCase().trim() });
  }
}

export const couponRepository = new CouponRepository();
