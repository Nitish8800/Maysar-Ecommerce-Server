import { Document, Types } from "mongoose";

/** A single highlight stat shown on the product detail page (e.g. "0g Added Sugar") */
export interface IProductHighlight {
  value: string; // e.g. "0g", "30 min", "100%"
  label: string; // e.g. "Added Sugar", "To Feel It", "Dose On Label"
}

/** A key active ingredient with its dose */
export interface IIngredient {
  name: string;  // e.g. "L-Carnitine"
  dose: string;  // e.g. "1500mg"
}

/** A purchasable pack option (e.g. 15 sachets / 30 sachets) */
export interface IPackOption {
  sku?: string;             // e.g. "MSR-RISE-15"
  name?: string;            // e.g. "15 Sachets" or "Pack of 15"
  sachets: number;          // e.g. 15 or 30
  price: number;            // e.g. 599
  pricePerServing: number;  // e.g. 40
  savings?: number;         // e.g. 199 (only on best-value pack)
  isBestValue?: boolean;    // flag to show "Best Value" badge
}

export interface IProduct extends Document {
  _id: Types.ObjectId;

  // ── Core ─────────────────────────────────────────────────────────────
  title: string;
  slug: string;
  description: string;
  shortTagline?: string;        // e.g. "Energy that lasts. Dosed like medicine, made like a treat."
  brand: string;
  category: Types.ObjectId;

  // ── Ritual / Category Label ───────────────────────────────────────────
  ritual?: string;              // e.g. "Morning Ritual", "Deep Sleep"

  // ── Flavors ──────────────────────────────────────────────────────────
  flavors: string[];            // e.g. ["Strawberry"]
  flavorNote?: string;          // e.g. "the only flavour, for now"

  // ── Product Sensory / Serving Info (shown on card) ───────────────────
  aromaNotes?: string[];        // e.g. ["Earthy", "Sweet"]
  servingStyle?: string;        // e.g. "Shake with 200ml water"

  // ── Product Highlights (3-stat block on detail page) ─────────────────
  highlights?: IProductHighlight[];

  // ── Ingredients ──────────────────────────────────────────────────────
  ingredients?: IIngredient[];  // Hero actives shown on card & detail

  // ── Badges / Certifications ──────────────────────────────────────────
  badges?: string[];            // e.g. ["Plant Based", "No Added Sugar", "Quality Tested"]

  // ── Packs (pricing options) ──────────────────────────────────────────
  packs?: IPackOption[];        // Multiple pack sizes with individual pricing

  // ── Bundle / Stack Offer ─────────────────────────────────────────────
  bundleOfferText?: string;     // e.g. "Stock two rituals, save 10%. Add any 2 tubs..."

  // ── Nutrition ────────────────────────────────────────────────────────
  nutritionLabelUrl?: string;   // URL to nutrition label image/PDF

  // ── Brand Colour & Background Gradient ────────────────────────────────
  brandColor?: string;          // e.g. "#E05A3A" (orange for Rise, purple for Rest)
  bgColor?: string;             // e.g. "linear-gradient(178deg, #FBF8EE 0%, #E6F7F3 42%, #C4EEE4 100%)"

  discount?: number;

  // ── Inventory ────────────────────────────────────────────────────────
  SKU: string;
  barcode?: string;
  stock: number;

  // ── Media ────────────────────────────────────────────────────────────
  images: string[];

  // ── Reviews ──────────────────────────────────────────────────────────
  ratings: number;
  reviewsCount: number;

  // ── Meta ─────────────────────────────────────────────────────────────
  tags: string[];
  status: "active" | "draft" | "archived";
  featured: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
