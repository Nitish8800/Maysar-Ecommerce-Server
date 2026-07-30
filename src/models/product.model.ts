import mongoose, { Schema } from "mongoose";
import { IProduct } from "../interfaces/product.interface";

const ProductHighlightSchema = new Schema(
  {
    value: { type: String, required: true }, // e.g. "0g", "30 min", "100%"
    label: { type: String, required: true }, // e.g. "Added Sugar", "To Feel It"
  },
  { _id: false }
);

const IngredientSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g. "L-Carnitine"
    dose: { type: String, required: true }, // e.g. "1500mg"
  },
  { _id: false }
);

const PackOptionSchema = new Schema(
  {
    sachets: { type: Number, required: true },           // e.g. 15 or 30
    price: { type: Number, required: true, min: 0 },     // e.g. 599
    pricePerServing: { type: Number, required: true, min: 0 }, // e.g. 40
    savings: { type: Number, min: 0 },                   // e.g. 199
    isBestValue: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    // ── Core ──────────────────────────────────────────────────────────
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    shortTagline: { type: String, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },

    // ── Ritual / Category Label ────────────────────────────────────────
    ritual: { type: String, trim: true },               // e.g. "Morning Ritual"

    // ── Flavors ───────────────────────────────────────────────────────
    flavors: [{ type: String, trim: true }],             // e.g. ["Strawberry"]
    flavorNote: { type: String, trim: true },            // e.g. "the only flavour, for now"

    // ── Sensory / Serving Info (shown on product card) ─────────────────
    aromaNotes: [{ type: String, trim: true }],          // e.g. ["Earthy", "Sweet"]
    servingStyle: { type: String, trim: true },          // e.g. "Shake with 200ml water"

    // ── Highlights (3-stat block on detail page) ──────────────────────
    highlights: [ProductHighlightSchema],

    // ── Ingredients (hero actives) ────────────────────────────────────
    ingredients: [IngredientSchema],

    // ── Badges / Certifications ───────────────────────────────────────
    badges: [{ type: String, trim: true }],              // e.g. ["Plant Based", "No Added Sugar"]

    // ── Packs (purchasable pack options) ──────────────────────────────
    packs: [PackOptionSchema],                           // e.g. 15 sachets / 30 sachets

    // ── Bundle / Stack Offer ──────────────────────────────────────────
    bundleOfferText: { type: String, trim: true },       // e.g. "Stock two rituals, save 10%..."

    // ── Nutrition ─────────────────────────────────────────────────────
    nutritionLabelUrl: { type: String, trim: true },     // URL to nutrition label image/PDF

    // ── Brand Colour (stack builder & card accent) ────────────────────
    brandColor: { type: String, trim: true },            // e.g. "#E05A3A"

    discount: { type: Number, default: 0 },

    // ── Inventory ─────────────────────────────────────────────────────
    SKU: { type: String, required: true, unique: true, uppercase: true, trim: true },
    barcode: { type: String, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },

    // ── Media ─────────────────────────────────────────────────────────
    images: [{ type: String }],
    thumbnail: { type: String, required: true },

    // ── Reviews ───────────────────────────────────────────────────────
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },

    // ── Meta ──────────────────────────────────────────────────────────
    tags: [{ type: String, trim: true }],
    status: { type: String, enum: ["active", "draft", "archived"], default: "active" },
    featured: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", description: "text", brand: "text", tags: "text" });

export const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);
