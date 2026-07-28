import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { sendSuccess } from "../utils/apiResponse.util";
import { asyncHandler } from "../helpers/asyncHandler.helper";

export class AuthController {
  public sendSignupOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, phone } = req.body;
    const result = await authService.sendSignupOTP(name, email, phone);
    sendSuccess(res, result.message);
  });

  public verifySignup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    const result = await authService.verifySignup(email, otp);
    sendSuccess(res, "Account created and verified successfully.", result);
  });

  public sendLoginOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const result = await authService.sendLoginOTP(email);
    sendSuccess(res, result.message);
  });

  public verifyLogin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    const result = await authService.verifyLogin(email, otp);
    sendSuccess(res, "Logged in successfully.", result);
  });

  public resendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, purpose } = req.body;
    const result = await authService.resendOTP(email, purpose);
    sendSuccess(res, result.message);
  });

  public getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, "Authenticated user retrieved successfully.", req.user);
  });

}

export const authController = new AuthController();
