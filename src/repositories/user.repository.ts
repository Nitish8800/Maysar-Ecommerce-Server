import { BaseRepository } from "./base.repository";
import { IUser } from "../interfaces/user.interface";
import { UserModel } from "../models/user.model";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email: email.toLowerCase().trim() });
  }
}

export const userRepository = new UserRepository();
