import { Request, Response } from "express";
import { returnService } from "../services/return.service";
import { sendSuccess } from "../utils/apiResponse.util";
import { asyncHandler } from "../helpers/asyncHandler.helper";

export class ReturnController {
  public getReturns = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const isCustomer = req.user?.role === "customer";
    const returns = await returnService.getReturns(isCustomer ? req.user!._id.toString() : undefined);
    sendSuccess(res, "Returns list fetched.", returns);
  });

  public updateReturnStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body;
    const updated = await returnService.updateReturnStatus(req.params.id, status);
    sendSuccess(res, "Return status updated.", updated);
  });
}

export const returnController = new ReturnController();
