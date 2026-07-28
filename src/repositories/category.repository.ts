import { BaseRepository } from "./base.repository";
import { ICategory } from "../interfaces/category.interface";
import { CategoryModel } from "../models/category.model";

export class CategoryRepository extends BaseRepository<ICategory> {
  constructor() {
    super(CategoryModel);
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    return await this.findOne({ slug: slug.toLowerCase() });
  }
}

export const categoryRepository = new CategoryRepository();
