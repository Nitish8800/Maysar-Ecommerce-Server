export interface IPaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface IJWTPayload {
  id: string;
  email: string;
  role: "customer" | "admin";
}

export interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
}
