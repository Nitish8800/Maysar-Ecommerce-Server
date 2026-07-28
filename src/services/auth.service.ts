import { userRepository } from "../repositories/user.repository";
import { otpRepository } from "../repositories/otp.repository";
import { emailService } from "./email.service";
import { generateOTP, hashOTP, compareOTP } from "../helpers/otp.helper";
import { generateToken } from "../helpers/jwt.helper";
import { ApiError } from "../utils/apiError.util";
import { IUser } from "../interfaces/user.interface";

export class AuthService {
  public async sendSignupOTP(name: string, email: string, phone?: string): Promise<{ message: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw ApiError.conflict("Email already registered.");
    }

    // Generate 6 digit OTP & hash
    const otp = generateOTP(6);
    const hashedOTP = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Remove any existing signup OTP for this email
    await otpRepository.deleteByEmailAndPurpose(normalizedEmail, "signup");

    // Store hashed OTP with metadata
    await otpRepository.create({
      email: normalizedEmail,
      hashedOTP,
      purpose: "signup",
      expiresAt,
      attempts: 0,
      metadata: { name, phone },
    });

    // Send email
    await emailService.sendOTPEmail(normalizedEmail, otp, "signup", name);

    return { message: "Verification OTP sent to your email." };
  }

  public async verifySignup(email: string, otp: string): Promise<{ token: string; user: IUser }> {
    const normalizedEmail = email.toLowerCase().trim();

    const otpDoc = await otpRepository.findByEmailAndPurpose(normalizedEmail, "signup");
    if (!otpDoc) {
      throw ApiError.badRequest("Invalid or expired OTP.");
    }

    // Check expiry
    if (new Date() > new Date(otpDoc.expiresAt)) {
      await otpRepository.deleteByEmailAndPurpose(normalizedEmail, "signup");
      throw ApiError.badRequest("OTP has expired. Please request a new verification code.");
    }

    // Compare hash
    const isValid = await compareOTP(otp, otpDoc.hashedOTP);
    if (!isValid) {
      otpDoc.attempts = (otpDoc.attempts || 0) + 1;
      if (otpDoc.attempts >= 5) {
        await otpRepository.deleteByEmailAndPurpose(normalizedEmail, "signup");
        throw ApiError.badRequest("Maximum verification attempts exceeded. Please request a new OTP.");
      }
      await otpDoc.save();
      throw ApiError.badRequest("Invalid verification code.");
    }

    // Create user
    const user = await userRepository.create({
      name: otpDoc.metadata?.name || "User",
      email: normalizedEmail,
      phone: otpDoc.metadata?.phone || "",
      role: "customer",
      isVerified: true,
      status: "active",
    });

    // Generate JWT
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Delete OTP
    await otpRepository.deleteByEmailAndPurpose(normalizedEmail, "signup");

    return { token, user };
  }

  public async sendLoginOTP(email: string): Promise<{ message: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    // Check user exists
    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw ApiError.notFound("No account found.");
    }

    if (user.status === "blocked") {
      throw ApiError.forbidden("Your account has been blocked. Please contact support.");
    }

    // Generate OTP & hash
    const otp = generateOTP(6);
    const hashedOTP = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Remove any existing login OTP for this email
    await otpRepository.deleteByEmailAndPurpose(normalizedEmail, "login");

    // Store OTP
    await otpRepository.create({
      email: normalizedEmail,
      hashedOTP,
      purpose: "login",
      expiresAt,
      attempts: 0,
    });

    // Send email
    await emailService.sendOTPEmail(normalizedEmail, otp, "login", user.name);

    return { message: "Login OTP sent to your email." };
  }

  public async verifyLogin(email: string, otp: string): Promise<{ token: string; user: IUser }> {
    const normalizedEmail = email.toLowerCase().trim();

    const otpDoc = await otpRepository.findByEmailAndPurpose(normalizedEmail, "login");
    if (!otpDoc) {
      throw ApiError.badRequest("Invalid or expired OTP.");
    }

    // Check expiry
    if (new Date() > new Date(otpDoc.expiresAt)) {
      await otpRepository.deleteByEmailAndPurpose(normalizedEmail, "login");
      throw ApiError.badRequest("OTP has expired. Please request a new verification code.");
    }

    // Compare hash
    const isValid = await compareOTP(otp, otpDoc.hashedOTP);
    if (!isValid) {
      otpDoc.attempts = (otpDoc.attempts || 0) + 1;
      if (otpDoc.attempts >= 5) {
        await otpRepository.deleteByEmailAndPurpose(normalizedEmail, "login");
        throw ApiError.badRequest("Maximum verification attempts exceeded. Please request a new OTP.");
      }
      await otpDoc.save();
      throw ApiError.badRequest("Invalid verification code.");
    }

    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw ApiError.notFound("User not found.");
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Delete OTP
    await otpRepository.deleteByEmailAndPurpose(normalizedEmail, "login");

    return { token, user };
  }

  public async resendOTP(email: string, purpose: "signup" | "login"): Promise<{ message: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    const existingOtp = await otpRepository.findByEmailAndPurpose(normalizedEmail, purpose);
    if (existingOtp) {
      const timePassedSeconds = (Date.now() - new Date(existingOtp.createdAt).getTime()) / 1000;
      if (timePassedSeconds < 60) {
        const remaining = Math.ceil(60 - timePassedSeconds);
        throw ApiError.badRequest(`Please wait ${remaining} seconds before requesting a new OTP.`);
      }
    }

    let recipientName = "";
    let metadata = existingOtp?.metadata;

    if (purpose === "login") {
      const user = await userRepository.findByEmail(normalizedEmail);
      if (!user) {
        throw ApiError.notFound("No account found.");
      }
      recipientName = user.name;
    } else {
      recipientName = metadata?.name || "";
    }

    // Invalidate previous OTP
    await otpRepository.deleteByEmailAndPurpose(normalizedEmail, purpose);

    // Generate new OTP
    const otp = generateOTP(6);
    const hashedOTP = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await otpRepository.create({
      email: normalizedEmail,
      hashedOTP,
      purpose,
      expiresAt,
      attempts: 0,
      metadata,
    });

    await emailService.sendOTPEmail(normalizedEmail, otp, purpose, recipientName);

    return { message: "New OTP has been sent to your email." };
  }
}

export const authService = new AuthService();
