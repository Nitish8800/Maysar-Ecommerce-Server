import { BaseRepository } from "./base.repository";
import { IProduct } from "../interfaces/product.interface";
import { ProductModel } from "../models/product.model";

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(ProductModel);
  }

  async findBySlug(slug: string): Promise<IProduct | null> {
    return await this.findOne({ slug: slug.toLowerCase() });
  }

  async findBySKU(sku: string): Promise<IProduct | null> {
    return await this.findOne({ SKU: sku.toUpperCase() });
  }
}

export const productRepository = new ProductRepository();
