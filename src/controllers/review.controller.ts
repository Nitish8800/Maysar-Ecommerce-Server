import { Request, Response } from "express";
import { reviewService } from "../services/review.service";
import { sendSuccess, sendCreated } from "../utils/apiResponse.util";
import { asyncHandler } from "../helpers/asyncHandler.helper";

export class ReviewController {
  public addReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { productId, rating, comment, images } = req.body;
    const review = await reviewService.addReview(
      req.user!._id.toString(),
      productId,
      rating,
      comment,
      images
    );
    sendCreated(res, "Review added successfully.", review);
  });

  public getProductReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const reviews = await reviewService.getProductReviews(req.params.productId);
    sendSuccess(res, "Product reviews fetched.", reviews);
  });

  public deleteReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await reviewService.deleteReview(req.params.id);
    sendSuccess(res, "Review deleted.");
  });
}

export const reviewController = new ReviewController();
