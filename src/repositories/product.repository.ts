import { BaseRepository } from "./base.repository";
import { IProduct } from "../interfaces/product.interface";
import { ProductModel } from "../models/product.model";
import { FilterQuery } from "mongoose";

// Fields to populate for category — returns id, name, slug, image
const CATEGORY_POPULATE = { path: "category", select: "name slug image status" };

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(ProductModel);
  }

  /** Find by MongoDB ObjectId — always populates category */
  async findById(id: string): Promise<IProduct | null> {
    return await this.model.findById(id).populate(CATEGORY_POPULATE).exec();
  }

  /** Find by slug — always populates category */
  async findBySlug(slug: string): Promise<IProduct | null> {
    return await this.model.findOne({ slug: slug.toLowerCase() }).populate(CATEGORY_POPULATE).exec();
  }

  /** Find by SKU */
  async findBySKU(sku: string): Promise<IProduct | null> {
    return await this.model.findOne({ SKU: sku.toUpperCase() }).exec();
  }

  /** Paginated product list — always populates category */
  async paginate(
    filter: FilterQuery<IProduct>,
    page: number = 1,
    limit: number = 10,
    sort: any = { createdAt: -1 }
  ): Promise<{ data: IProduct[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const total = await this.model.countDocuments(filter).exec();
    const data = await this.model
      .find(filter)
      .populate(CATEGORY_POPULATE)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    const totalPages = Math.ceil(total / limit) || 1;
    return { data, total, page, totalPages };
  }
}

export const productRepository = new ProductRepository();
