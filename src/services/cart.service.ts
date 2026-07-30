import { cartRepository } from "../repositories/cart.repository";
import { productRepository } from "../repositories/product.repository";
import { ApiError } from "../utils/apiError.util";
import { ICart } from "../interfaces/cart.interface";

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
    const product = await productRepository.findById(productId);
    if (!product) throw ApiError.notFound("Product not found.");
    if (product.stock < quantity) throw ApiError.badRequest("Insufficient product stock.");

    let cart = await cartRepository.findOne({ customer: customerId });
    if (!cart) {
      cart = await cartRepository.create({
        customer: customerId as any,
        items: [],
        grandTotal: 0,
      });
    }

    // Resolve pack price — use the selected pack, fall back to index 0
    const packs = product.packs ?? [];
    const selectedPack = packs[packIndex] ?? packs[0];
    if (!selectedPack) throw ApiError.badRequest("Product has no pack options defined.");
    const price = selectedPack.price;
    const existingIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].subtotal = cart.items[existingIndex].quantity * price;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        price,
        subtotal: quantity * price,
      });
    }

    cart.grandTotal = cart.items.reduce((total, item) => total + item.subtotal, 0);
    await cart.save();
    return await cart.populate("items.product");
  }

  public async updateCartItem(customerId: string, productId: string, quantity: number): Promise<ICart> {
    const cart = await cartRepository.findOne({ customer: customerId });
    if (!cart) throw ApiError.notFound("Cart not found.");

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex === -1) throw ApiError.notFound("Item not in cart.");

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await productRepository.findById(productId);
      if (!product) throw ApiError.notFound("Product not found.");
      if (product.stock < quantity) throw ApiError.badRequest("Insufficient stock.");

      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subtotal = quantity * cart.items[itemIndex].price;
    }

    cart.grandTotal = cart.items.reduce((total, item) => total + item.subtotal, 0);
    await cart.save();
    return await cart.populate("items.product");
  }

  public async removeCartItem(customerId: string, productId: string): Promise<ICart> {
    return await this.updateCartItem(customerId, productId, 0);
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
