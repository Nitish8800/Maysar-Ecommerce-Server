import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { sendSuccess } from "../utils/apiResponse.util";
import { asyncHandler } from "../helpers/asyncHandler.helper";

export class UserController {
  public getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const profile = await userService.getProfile(req.user!._id.toString());
    sendSuccess(res, "Profile retrieved successfully.", profile);
  });

  public updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updated = await userService.updateProfile(req.user!._id.toString(), req.body);
    sendSuccess(res, "Profile updated successfully.", updated);
  });

  // Addresses
  public getAddresses = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const addresses = await userService.getAddresses(req.user!._id.toString());
    sendSuccess(res, "Addresses retrieved.", addresses);
  });

  public addAddress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const addresses = await userService.addAddress(req.user!._id.toString(), req.body);
    sendSuccess(res, "Address added successfully.", addresses);
  });

  public updateAddress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const addresses = await userService.updateAddress(req.user!._id.toString(), req.params.id, req.body);
    sendSuccess(res, "Address updated successfully.", addresses);
  });

  public deleteAddress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const addresses = await userService.deleteAddress(req.user!._id.toString(), req.params.id);
    sendSuccess(res, "Address deleted successfully.", addresses);
  });

  public setDefaultAddress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const addresses = await userService.setDefaultAddress(req.user!._id.toString(), req.params.id);
    sendSuccess(res, "Default address set.", addresses);
  });

  // Wishlist
  public getWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const wishlist = await userService.getWishlist(req.user!._id.toString());
    sendSuccess(res, "Wishlist retrieved.", wishlist);
  });

  public addToWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const productId = req.body.productId || req.body.id || req.body._id;
    const wishlist = await userService.addToWishlist(req.user!._id.toString(), productId);
    sendSuccess(res, "Item added to wishlist.", wishlist);
  });

  public removeFromWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const wishlist = await userService.removeFromWishlist(req.user!._id.toString(), req.params.productId);
    sendSuccess(res, "Item removed from wishlist.", wishlist);
  });

  public clearWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const wishlist = await userService.clearWishlist(req.user!._id.toString());
    sendSuccess(res, "Wishlist cleared.", wishlist);
  });

  // Payment Methods
  public getPaymentMethods = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const methods = await userService.getPaymentMethods(req.user!._id.toString());
    sendSuccess(res, "Payment methods retrieved.", methods);
  });

  public addPaymentMethod = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const methods = await userService.addPaymentMethod(req.user!._id.toString(), req.body);
    sendSuccess(res, "Payment method saved.", methods);
  });

  public deletePaymentMethod = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const methods = await userService.deletePaymentMethod(req.user!._id.toString(), req.params.id);
    sendSuccess(res, "Payment method deleted.", methods);
  });
}

export const userController = new UserController();
