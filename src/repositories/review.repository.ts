import { BaseRepository } from "./base.repository";
import { IReview } from "../interfaces/review.interface";
import { ReviewModel } from "../models/review.model";

export class ReviewRepository extends BaseRepository<IReview> {
  constructor() {
    super(ReviewModel);
  }

  async findByProductId(productId: string): Promise<IReview[]> {
    return await this.model.find({ product: productId }).populate("customer", "name avatar").sort({ createdAt: -1 }).exec();
  }
}

export const reviewRepository = new ReviewRepository();
