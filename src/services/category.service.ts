import { categoryRepository } from "../repositories/category.repository";
import { generateSlug } from "../helpers/slug.helper";
import { ApiError } from "../utils/apiError.util";
import { ICategory } from "../interfaces/category.interface";

export class CategoryService {
  public async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    const slug = generateSlug(data.name || "");
    const existing = await categoryRepository.findBySlug(slug);
    if (existing) {
      throw ApiError.conflict("Category already exists.");
    }

    return await categoryRepository.create({
      ...data,
      slug,
    });
  }

  public async getCategories(status?: string): Promise<ICategory[]> {
    const filter = status ? { status } : {};
    return await categoryRepository.find(filter);
  }

  public async getCategoryById(id: string): Promise<ICategory> {
    const category = await categoryRepository.findById(id);
    if (!category) throw ApiError.notFound("Category not found.");
    return category;
  }

  public async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory> {
    if (data.name) {
      data.slug = generateSlug(data.name);
    }
    const updated = await categoryRepository.updateById(id, data);
    if (!updated) throw ApiError.notFound("Category not found.");
    return updated;
  }

  public async deleteCategory(id: string): Promise<boolean> {
    const deleted = await categoryRepository.deleteById(id);
    if (!deleted) throw ApiError.notFound("Category not found.");
    return true;
  }
}

export const categoryService = new CategoryService();
