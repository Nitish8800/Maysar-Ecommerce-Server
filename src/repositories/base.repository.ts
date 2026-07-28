import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import { IBaseRepository } from "../interfaces/repository.interface";

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data as T);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async find(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]> {
    return await this.model.find(filter, null, options).exec();
  }

  async updateById(id: string, updateData: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async updateOne(filter: FilterQuery<T>, updateData: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findOneAndUpdate(filter, updateData, { new: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this.model.deleteOne(filter).exec();
    return (result.deletedCount ?? 0) > 0;
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    return await this.model.countDocuments(filter).exec();
  }

  async paginate(
    filter: FilterQuery<T>,
    page: number = 1,
    limit: number = 10,
    sort: any = { createdAt: -1 }
  ): Promise<{ data: T[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const total = await this.count(filter);
    const data = await this.model.find(filter).sort(sort).skip(skip).limit(limit).exec();
    const totalPages = Math.ceil(total / limit) || 1;

    return { data, total, page, totalPages };
  }
}
