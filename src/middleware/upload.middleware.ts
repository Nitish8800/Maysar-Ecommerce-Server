import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config";

// ─── Shared Multer options ────────────────────────────────────────────────────
const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "webp", "avif", "gif"];
const MAX_FILE_SIZE_MB = 10;

// ─── Product Gallery Storage ──────────────────────────────────────────────────
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, _file) => ({
    folder: "maysar/products/gallery",
    allowed_formats: ALLOWED_FORMATS,
    transformation: [
      { width: 1200, height: 1200, crop: "limit", quality: "auto:best", fetch_format: "auto" },
    ],
    resource_type: "image",
  }),
});

// ─── Avatar Storage ───────────────────────────────────────────────────────────
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, _file) => ({
    folder: "maysar/avatars",
    allowed_formats: ALLOWED_FORMATS,
    transformation: [
      { width: 300, height: 300, crop: "fill", gravity: "face", quality: "auto:good", fetch_format: "auto" },
    ],
    resource_type: "image",
  }),
});

// ─── File Filter ──────────────────────────────────────────────────────────────
const imageFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed.") as any, false);
  }
};

// ─── Multer Instances ─────────────────────────────────────────────────────────
export const uploadProductGallery = multer({
  storage: galleryStorage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: imageFilter,
}).array("images", 10);

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB cap for avatars
  fileFilter: imageFilter,
}).single("avatar");
