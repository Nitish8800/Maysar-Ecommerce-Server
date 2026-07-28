import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";
import { userService } from "../services/user.service";
import { sendSuccess, sendCreated } from "../utils/apiResponse.util";
import { asyncHandler } from "../helpers/asyncHandler.helper";

export class PaymentController {
  public processPayment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { orderId, paymentGateway, amount, transactionId } = req.body;
    const payment = await paymentService.processPayment(
      req.user!._id.toString(),
      orderId,
      paymentGateway,
      amount,
      transactionId
    );
    sendCreated(res, "Payment processed successfully.", payment);
  });

  public getPayments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const isCustomer = req.user?.role === "customer";
    const payments = await paymentService.getPayments(isCustomer ? req.user!._id.toString() : undefined);
    sendSuccess(res, "Payments list fetched.", payments);
  });

  public getPaymentMethods = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const methods = await userService.getPaymentMethods(req.user!._id.toString());
    sendSuccess(res, "Saved payment methods.", methods);
  });

  public addPaymentMethod = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const methods = await userService.addPaymentMethod(req.user!._id.toString(), req.body);
    sendCreated(res, "Payment method saved.", methods);
  });

  public deletePaymentMethod = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const methods = await userService.deletePaymentMethod(req.user!._id.toString(), req.params.id);
    sendSuccess(res, "Payment method deleted.", methods);
  });
}

export const paymentController = new PaymentController();
