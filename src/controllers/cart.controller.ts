import { Request, Response } from "express";
import { cartService } from "../services/cart.service";
import { sendSuccess } from "../utils/apiResponse.util";
import { asyncHandler } from "../helpers/asyncHandler.helper";

export class CartController {
  public getCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const cart = await cartService.getCart(req.user!._id.toString());
    sendSuccess(res, "Cart fetched successfully.", cart);
  });

  public addToCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { productId, quantity, packIndex } = req.body;
    const cart = await cartService.addToCart(req.user!._id.toString(), productId, quantity, packIndex ?? 0);
    sendSuccess(res, "Item added to cart.", cart);
  });

  public updateCartItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { quantity, packIndex } = req.body;
    const cart = await cartService.updateCartItem(req.user!._id.toString(), req.params.productId, quantity, packIndex);
    sendSuccess(res, "Cart item updated.", cart);
  });

  public removeCartItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const packIndex = req.query.packIndex ? Number(req.query.packIndex) : undefined;
    const cart = await cartService.removeCartItem(req.user!._id.toString(), req.params.productId, packIndex);
    sendSuccess(res, "Item removed from cart.", cart);
  });

  public clearCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const cart = await cartService.clearCart(req.user!._id.toString());
    sendSuccess(res, "Cart cleared.", cart);
  });
}

export const cartController = new CartController();
