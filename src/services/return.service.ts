import { returnRepository } from "../repositories/return.repository";
import { ApiError } from "../utils/apiError.util";
import { IReturn } from "../interfaces/return.interface";

export class ReturnService {
  public async getReturns(customerId?: string): Promise<IReturn[]> {
    const filter = customerId ? { customer: customerId } : {};
    return await returnRepository.find(filter);
  }

  public async updateReturnStatus(
    returnId: string,
    status: "requested" | "approved" | "rejected" | "completed"
  ): Promise<IReturn> {
    const updated = await returnRepository.updateById(returnId, { status });
    if (!updated) throw ApiError.notFound("Return request not found.");
    return updated;
  }
}

export const returnService = new ReturnService();
