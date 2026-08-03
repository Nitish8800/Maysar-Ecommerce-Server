import mongoose from "mongoose";
import { cartRepository } from "../repositories/cart.repository";
import { productRepository } from "../repositories/product.repository";
import { ApiError } from "../utils/apiError.util";
import { ICart } from "../interfaces/cart.interface";
import { ProductModel } from "../models/product.model";

export class CartService {
  public async getCart(customerId: string): Promise<ICart> {
    let cart = await cartRepository.findByCustomerId(customerId);
    if (!cart) {
      cart = await cartRepository.create({
        customer: customerId as any,
        items: [],
        grandTotal: 0,
      });
    }
    return cart;
  }

  public async addToCart(customerId: string, productId: string, quantity: number, packIndex: number = 0): Promise<ICart> {
    let product: any | null = null;

    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await productRepository.findById(productId);
    }
    if (!product) {
      product = await productRepository.findBySlug(productId);
    }
    if (!product) {
      product = await ProductModel.findOne({
        $or: [
          { slug: { $regex: productId, $options: "i" } },
          { title: { $regex: productId, $options: "i" } },
        ],
      }).populate({ path: "category", select: "name slug image status" }).exec();
    }

    if (!product) throw ApiError.notFound("Product not found.");

    if (product.stock > 0 && product.stock < quantity) {
      throw ApiError.badRequest("Insufficient product stock.");
    }

    let cart = await cartRepository.findOne({ customer: customerId });
    if (!cart) {
      cart = await cartRepository.create({
        customer: customerId as any,
        items: [],
        grandTotal: 0,
      });
    }

    const pIdx = Number(packIndex || 0);
    const packs = product.packs ?? [];
    const selectedPack = packs[pIdx] ?? packs[0];
    const price = selectedPack ? selectedPack.price : ((product as any).price || 999);
    const variantName = selectedPack?.name || (selectedPack?.sachets ? `${selectedPack.sachets} Sachets` : `Pack ${pIdx + 1}`);
    const variantSku = selectedPack?.sku || (selectedPack?.sachets ? `${product.SKU}-${selectedPack.sachets}S` : product.SKU);
    const sachets = selectedPack?.sachets || 15;

    const prodIdStr = product._id.toString();
    const existingIndex = cart.items.findIndex((item) => item.product.toString() === prodIdStr && Number(item.packIndex ?? 0) === pIdx);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].packIndex = pIdx;
      cart.items[existingIndex].variantName = variantName;
      cart.items[existingIndex].sku = variantSku;
      cart.items[existingIndex].sachets = sachets;
      cart.items[existingIndex].price = price;
      cart.items[existingIndex].subtotal = cart.items[existingIndex].quantity * price;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        packIndex: pIdx,
        variantName,
        sku: variantSku,
        sachets,
        price,
        subtotal: quantity * price,
      });
    }

    cart.grandTotal = cart.items.reduce((total, item) => total + item.subtotal, 0);
    await cart.save();
    return await cart.populate("items.product");
  }

  public async updateCartItem(customerId: string, productId: string, quantity: number, packIndex?: number): Promise<ICart> {
    const cart = await cartRepository.findOne({ customer: customerId });
    if (!cart) throw ApiError.notFound("Cart not found.");

    let targetProdId = productId;
    let targetPackIndex = packIndex;

    if (productId.includes("_pack")) {
      const [pId, pIdx] = productId.split("_pack");
      targetProdId = pId;
      targetPackIndex = parseInt(pIdx, 10);
    }

    if (targetPackIndex !== undefined) {
      targetPackIndex = Number(targetPackIndex);
    }

    if (!mongoose.Types.ObjectId.isValid(targetProdId)) {
      let p = await productRepository.findBySlug(targetProdId);
      if (!p) {
        p = await ProductModel.findOne({
          $or: [
            { slug: { $regex: targetProdId, $options: "i" } },
            { title: { $regex: targetProdId, $options: "i" } },
          ],
        }).exec();
      }
      if (p) targetProdId = p._id.toString();
    }

    let itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === targetProdId && (targetPackIndex === undefined || Number(item.packIndex ?? 0) === targetPackIndex)
    );

    if (itemIndex === -1) {
      // If item for target packIndex doesn't exist yet and quantity > 0, add it
      if (quantity > 0) {
        return await this.addToCart(customerId, targetProdId, quantity, targetPackIndex ?? 0);
      }
      return cart;
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await productRepository.findById(targetProdId);
      if (!product) throw ApiError.notFound("Product not found.");
      if (product.stock > 0 && product.stock < quantity) {
        throw ApiError.badRequest("Insufficient stock.");
      }

      const pIdx = targetPackIndex ?? Number(cart.items[itemIndex].packIndex ?? 0);
      const packs = product.packs ?? [];
      const selectedPack = packs[pIdx] ?? packs[0];
      const price = selectedPack ? selectedPack.price : (cart.items[itemIndex].price || (product as any).price || 999);

      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = price;
      cart.items[itemIndex].subtotal = quantity * price;
    }

    cart.grandTotal = cart.items.reduce((total, item) => total + item.subtotal, 0);
    await cart.save();
    return await cart.populate("items.product");
  }

  public async removeCartItem(customerId: string, productId: string, packIndex?: number): Promise<ICart> {
    return await this.updateCartItem(customerId, productId, 0, packIndex);
  }

  public async clearCart(customerId: string): Promise<ICart> {
    let cart = await cartRepository.findOne({ customer: customerId });
    if (!cart) throw ApiError.notFound("Cart not found.");

    cart.items = [];
    cart.grandTotal = 0;
    await cart.save();
    return cart;
  }
}

export const cartService = new CartService();
