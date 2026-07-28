import { Request, Response } from "express";
import { productService } from "../services/product.service";
import { sendSuccess, sendCreated } from "../utils/apiResponse.util";
import { asyncHandler } from "../helpers/asyncHandler.helper";

export class ProductController {
  public createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const product = await productService.createProduct(req.body, req.user?._id.toString());
    sendCreated(res, "Product created successfully.", product);
  });

  public getProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await productService.getProducts(req.query as any);
    sendSuccess(res, "Products fetched successfully.", result.data, {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });
  });

  public getProductDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const product = await productService.getProductByIdOrSlug(req.params.identifier);
    sendSuccess(res, "Product details fetched.", product);
  });

  public updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const product = await productService.updateProduct(req.params.id, req.body);
    sendSuccess(res, "Product updated successfully.", product);
  });

  public deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await productService.deleteProduct(req.params.id);
    sendSuccess(res, "Product deleted successfully.");
  });
}

export const productController = new ProductController();
