declare module "razorpay" {
  class Razorpay {
    constructor(options: { key_id: string; key_secret: string });
    orders: {
      create(
        options: {
          amount: number;
          currency: string;
          receipt?: string;
          notes?: Record<string, any>;
        },
        callback?: (err: any, order: any) => void
      ): Promise<any>;
      fetch(orderId: string): Promise<any>;
    };
    payments: {
      fetch(paymentId: string): Promise<any>;
      capture(paymentId: string, amount: number, currency: string): Promise<any>;
    };
  }
  export default Razorpay;
}
