import { Request, Response } from "express";
import { orderService } from "../services/order.service";
import { sendSuccess, sendCreated } from "../utils/apiResponse.util";
import { asyncHandler } from "../helpers/asyncHandler.helper";

export class OrderController {
  public createOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { shippingAddress, billingAddress, paymentMethod, couponCode } = req.body;
    const order = await orderService.createOrder(
      req.user!._id.toString(),
      shippingAddress,
      billingAddress,
      paymentMethod,
      couponCode
    );
    sendCreated(res, "Order placed successfully.", order);
  });

  public getCustomerOrders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const orders = await orderService.getCustomerOrders(req.user!._id.toString());
    sendSuccess(res, "Customer orders fetched.", orders);
  });

  public getOrderDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const order = await orderService.getOrderDetails(req.params.id, req.user!._id.toString());
    sendSuccess(res, "Order details fetched.", order);
  });

  public cancelOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const order = await orderService.cancelOrder(req.params.id, req.user!._id.toString());
    sendSuccess(res, "Order cancelled successfully.", order);
  });

  public trackOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const tracking = await orderService.trackOrder(req.params.id, req.user!._id.toString());
    sendSuccess(res, "Order tracking info.", tracking);
  });

  public returnOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { reason, description, images } = req.body;
    const returnReq = await orderService.requestReturn(
      req.params.id,
      req.user!._id.toString(),
      reason,
      description,
      images
    );
    sendCreated(res, "Return request submitted.", returnReq);
  });
}

export const orderController = new OrderController();
