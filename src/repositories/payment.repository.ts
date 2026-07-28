import { BaseRepository } from "./base.repository";
import { IPayment } from "../interfaces/payment.interface";
import { PaymentModel } from "../models/payment.model";

export class PaymentRepository extends BaseRepository<IPayment> {
  constructor() {
    super(PaymentModel);
  }

  async findByTransactionId(transactionId: string): Promise<IPayment | null> {
    return await this.findOne({ transactionId });
  }
}

export const paymentRepository = new PaymentRepository();
