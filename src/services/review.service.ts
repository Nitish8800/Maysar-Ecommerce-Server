import { reviewRepository } from "../repositories/review.repository";
import { productRepository } from "../repositories/product.repository";
import { ApiError } from "../utils/apiError.util";
import { IReview } from "../interfaces/review.interface";

export class ReviewService {
  public async addReview(
    customerId: string,
    productId: string,
    rating: number,
    comment: string,
    images: string[] = []
  ): Promise<IReview> {
    const product = await productRepository.findById(productId);
    if (!product) throw ApiError.notFound("Product not found.");

    const review = await reviewRepository.create({
      customer: customerId as any,
      product: productId as any,
      rating,
      comment,
      images,
    });

    // Recalculate average product rating
    const allReviews = await reviewRepository.findByProductId(productId);
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round((totalRating / allReviews.length) * 10) / 10;

    product.ratings = avgRating;
    product.reviewsCount = allReviews.length;
    await product.save();

    return review;
  }

  public async getProductReviews(productId: string): Promise<IReview[]> {
    return await reviewRepository.findByProductId(productId);
  }

  public async deleteReview(reviewId: string): Promise<boolean> {
    const review = await reviewRepository.findById(reviewId);
    if (!review) throw ApiError.notFound("Review not found.");

    const productId = review.product.toString();
    await reviewRepository.deleteById(reviewId);

    // Update product rating
    const allReviews = await reviewRepository.findByProductId(productId);
    const product = await productRepository.findById(productId);
    if (product) {
      if (allReviews.length === 0) {
        product.ratings = 0;
        product.reviewsCount = 0;
      } else {
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        product.ratings = Math.round((totalRating / allReviews.length) * 10) / 10;
        product.reviewsCount = allReviews.length;
      }
      await product.save();
    }

    return true;
  }
}

export const reviewService = new ReviewService();
