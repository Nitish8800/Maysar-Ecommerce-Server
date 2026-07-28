import { productRepository } from "../repositories/product.repository";
import { generateSlug } from "../helpers/slug.helper";
import { ApiError } from "../utils/apiError.util";
import { IProduct } from "../interfaces/product.interface";
import { IPaginationQuery } from "../types/common.types";
import { FilterQuery } from "mongoose";

export class ProductService {
  public async createProduct(productData: Partial<IProduct>, userId?: string): Promise<IProduct> {
    const slug = generateSlug(productData.title || "");
    const existing = await productRepository.findBySlug(slug);
    if (existing) {
      throw ApiError.conflict("A product with a similar title already exists.");
    }

    if (productData.SKU) {
      const existingSKU = await productRepository.findBySKU(productData.SKU);
      if (existingSKU) throw ApiError.conflict("SKU already exists.");
    }

    const newProduct = await productRepository.create({
      ...productData,
      slug,
      createdBy: userId as any,
    });

    return newProduct;
  }

  public async getProducts(query: IPaginationQuery): Promise<{ data: IProduct[]; total: number; page: number; totalPages: number }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const filter: FilterQuery<IProduct> = {};

    if (query.status) {
      filter.status = query.status;
    } else {
      filter.status = "active";
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice !== undefined) filter.price.$lte = Number(query.maxPrice);
    }

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    let sort: any = { createdAt: -1 };
    if (query.sort === "price_asc") sort = { price: 1 };
    if (query.sort === "price_desc") sort = { price: -1 };
    if (query.sort === "rating") sort = { ratings: -1 };

    return await productRepository.paginate(filter, page, limit, sort);
  }

  public async getProductByIdOrSlug(identifier: string): Promise<IProduct> {
    let product: IProduct | null = null;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await productRepository.findById(identifier);
    } else {
      product = await productRepository.findBySlug(identifier);
    }

    if (!product) {
      throw ApiError.notFound("Product not found.");
    }
    return product;
  }

  public async updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct> {
    if (updateData.title) {
      updateData.slug = generateSlug(updateData.title);
    }

    const updated = await productRepository.updateById(id, updateData);
    if (!updated) {
      throw ApiError.notFound("Product not found.");
    }
    return updated;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const deleted = await productRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound("Product not found.");
    }
    return true;
  }
}

export const productService = new ProductService();
