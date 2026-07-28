import { BaseRepository } from "./base.repository";
import { IOTP } from "../interfaces/otp.interface";
import { OTPModel } from "../models/otp.model";

export class OTPRepository extends BaseRepository<IOTP> {
  constructor() {
    super(OTPModel);
  }

  async findByEmailAndPurpose(email: string, purpose: "signup" | "login"): Promise<IOTP | null> {
    return await this.findOne({ email: email.toLowerCase().trim(), purpose });
  }

  async deleteByEmailAndPurpose(email: string, purpose: "signup" | "login"): Promise<boolean> {
    return await this.deleteOne({ email: email.toLowerCase().trim(), purpose });
  }
}

export const otpRepository = new OTPRepository();
