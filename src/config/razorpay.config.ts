import Razorpay from "razorpay";
import { env } from "./env.config";

export const razorpayInstance = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});
