import { couponRepository } from "../repositories/coupon.repository";
import { ApiError } from "../utils/apiError.util";
import { ICoupon } from "../interfaces/coupon.interface";

export class CouponService {
  public async createCoupon(data: Partial<ICoupon>): Promise<ICoupon> {
    const existing = await couponRepository.findByCode(data.code || "");
    if (existing) throw ApiError.conflict("Coupon code already exists.");

    return await couponRepository.create(data);
  }

  public async getCoupons(): Promise<ICoupon[]> {
    return await couponRepository.find({});
  }

  public async validateCoupon(code: string, cartTotal: number): Promise<ICoupon> {
    const coupon = await couponRepository.findByCode(code);
    if (!coupon) throw ApiError.notFound("Coupon code not found.");

    if (coupon.status !== "active") throw ApiError.badRequest("Coupon is inactive.");
    if (new Date() > new Date(coupon.expiryDate)) throw ApiError.badRequest("Coupon has expired.");
    if (cartTotal < coupon.minimumOrder) {
      throw ApiError.badRequest(`Minimum order of $${coupon.minimumOrder} required.`);
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      throw ApiError.badRequest("Coupon usage limit reached.");
    }

    return coupon;
  }

  public async updateCoupon(id: string, data: Partial<ICoupon>): Promise<ICoupon> {
    const updated = await couponRepository.updateById(id, data);
    if (!updated) throw ApiError.notFound("Coupon not found.");
    return updated;
  }

  public async deleteCoupon(id: string): Promise<boolean> {
    const deleted = await couponRepository.deleteById(id);
    if (!deleted) throw ApiError.notFound("Coupon not found.");
    return true;
  }
}

export const couponService = new CouponService();
