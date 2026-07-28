import { IUser } from "../schema";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
