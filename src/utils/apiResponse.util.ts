import { Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus.constant";

export interface IApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: any;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: any
): Response => {
  const response: IApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    statusCode,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  };
  return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  meta?: any,
  statusCode: number = HTTP_STATUS.OK
): Response => {
  return sendResponse(res, statusCode, message, data, meta);
};

export const sendCreated = <T>(
  res: Response,
  message: string,
  data?: T,
  meta?: any
): Response => {
  return sendResponse(res, HTTP_STATUS.CREATED, message, data, meta);
};
