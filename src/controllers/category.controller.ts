import { Request, Response } from "express";
import { categoryService } from "../services/category.service";
import { sendSuccess, sendCreated } from "../utils/apiResponse.util";
import { asyncHandler } from "../helpers/asyncHandler.helper";

export class CategoryController {
  public createCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const category = await categoryService.createCategory(req.body);
    sendCreated(res, "Category created successfully.", category);
  });

  public getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const categories = await categoryService.getCategories(req.query.status as string);
    sendSuccess(res, "Categories fetched.", categories);
  });

  public getCategoryById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const category = await categoryService.getCategoryById(req.params.id);
    sendSuccess(res, "Category details.", category);
  });

  public updateCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    sendSuccess(res, "Category updated.", category);
  });

  public deleteCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await categoryService.deleteCategory(req.params.id);
    sendSuccess(res, "Category deleted.");
  });
}

export const categoryController = new CategoryController();
