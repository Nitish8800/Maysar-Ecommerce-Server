import { Request, Response } from "express";
import { asyncHandler } from "../helpers/asyncHandler.helper";
import { sendSuccess } from "../utils/apiResponse.util";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/apiError.util";
import { deleteFromCloudinary } from "../config/cloudinary.config";

// ─── Product Thumbnail Upload ─────────────────────────────────────────────────
/**
 * POST /api/products/upload/thumbnail
 * Expects multipart/form-data with field "thumbnail"
 * Returns { url, publicId }
 */
export const handleThumbnailUpload = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    throw ApiError.badRequest("No thumbnail file provided.");
  }

  const file = req.file as Express.Multer.File & { path: string; filename: string };

  sendSuccess(res, "Thumbnail uploaded successfully.", {
    url: file.path,
    publicId: file.filename,
  });
});

// ─── Product Gallery Upload ───────────────────────────────────────────────────
/**
 * POST /api/products/upload/gallery
 * Expects multipart/form-data with field "images" (up to 10 files)
 * Returns { urls: string[], publicIds: string[] }
 */
export const handleGalleryUpload = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    throw ApiError.badRequest("No gallery images provided.");
  }

  const files = req.files as (Express.Multer.File & { path: string; filename: string })[];

  const urls = files.map((f) => f.path);
  const publicIds = files.map((f) => f.filename);

  sendSuccess(res, "Gallery images uploaded successfully.", { urls, publicIds });
});

// ─── Avatar Upload ────────────────────────────────────────────────────────────
/**
 * POST /api/users/profile/avatar
 * Expects multipart/form-data with field "avatar"
 * Saves the Cloudinary URL to the authenticated user's profile
 * Returns updated user
 */
export const handleAvatarUpload = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    throw ApiError.badRequest("No avatar file provided.");
  }

  const userId = req.user!._id.toString();
  const file = req.file as Express.Multer.File & { path: string; filename: string };
  const newAvatarUrl = file.path;

  // If user already has an avatar stored in Cloudinary, delete the old one
  const existingUser = await userRepository.findById(userId);
  if (existingUser?.avatar && existingUser.avatar.includes("cloudinary.com")) {
    // Extract publicId from the URL e.g. "maysar/avatars/xyz"
    const parts = existingUser.avatar.split("/");
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx !== -1) {
      // Skip "upload" and version segment (v12345678) if present
      const afterUpload = parts.slice(uploadIdx + 1);
      const versionRegex = /^v\d+$/;
      const publicIdParts = versionRegex.test(afterUpload[0]) ? afterUpload.slice(1) : afterUpload;
      const publicIdWithExt = publicIdParts.join("/");
      const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // strip extension
      await deleteFromCloudinary(publicId);
    }
  }

  const updatedUser = await userRepository.updateById(userId, { avatar: newAvatarUrl });
  if (!updatedUser) throw ApiError.notFound("User not found.");

  sendSuccess(res, "Avatar updated successfully.", {
    avatar: newAvatarUrl,
    publicId: file.filename,
    user: updatedUser,
  });
});
