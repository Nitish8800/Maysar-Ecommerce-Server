import bcrypt from "bcrypt";

export const generateOTP = (length: number = 6): string => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};

export const hashOTP = async (otp: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(otp, saltRounds);
};

export const compareOTP = async (plainOTP: string, hashedOTP: string): Promise<boolean> => {
  return await bcrypt.compare(plainOTP, hashedOTP);
};
