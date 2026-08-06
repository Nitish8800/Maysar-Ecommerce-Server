import { Request, Response } from "express";
import { couponService } from "../services/coupon.service";
import { sendSuccess, sendCreated } from "../utils/apiResponse.util";
import { asyncHandler } from "../helpers/asyncHandler.helper";

export class CouponController {
  public createCoupon = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const coupon = await couponService.createCoupon(req.body);
    sendCreated(res, "Coupon created.", coupon);
  });

  public getCoupons = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const coupons = await couponService.getCoupons();
    sendSuccess(res, "Coupons fetched.", coupons);
  });

  public validateCoupon = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { code, cartTotal } = req.body;
    const { coupon, discountAmount } = await couponService.validateCoupon(code, Number(cartTotal));
    sendSuccess(res, "Coupon is valid.", { ...coupon.toObject(), discountAmount });
  });

  public updateCoupon = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    sendSuccess(res, "Coupon updated.", coupon);
  });

  public deleteCoupon = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await couponService.deleteCoupon(req.params.id);
    sendSuccess(res, "Coupon deleted.");
  });
}

export const couponController = new CouponController();
