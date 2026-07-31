import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.config";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Delete an asset from Cloudinary by its public_id.
 * Call this when a product is deleted or an image is replaced.
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("[Cloudinary] Failed to delete asset:", publicId, err);
  }
};

export default cloudinary;
