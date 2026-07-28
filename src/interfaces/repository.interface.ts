import { FilterQuery, UpdateQuery, QueryOptions } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  find(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]>;
  updateById(id: string, updateData: UpdateQuery<T>): Promise<T | null>;
  updateOne(filter: FilterQuery<T>, updateData: UpdateQuery<T>): Promise<T | null>;
  deleteById(id: string): Promise<T | null>;
  deleteOne(filter: FilterQuery<T>): Promise<boolean>;
  count(filter: FilterQuery<T>): Promise<number>;
  paginate(
    filter: FilterQuery<T>,
    page: number,
    limit: number,
    sort?: any
  ): Promise<{ data: T[]; total: number; page: number; totalPages: number }>;
}
