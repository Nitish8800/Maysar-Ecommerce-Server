import mongoose from "mongoose";
import { userRepository } from "../repositories/user.repository";
import { productRepository } from "../repositories/product.repository";
import { ApiError } from "../utils/apiError.util";
import { IUser, IAddress, IPaymentMethod } from "../interfaces/user.interface";

export class UserService {
  public async getProfile(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found.");
    }
    return user;
  }

  public async updateProfile(
    userId: string,
    updateData: { name?: string; phone?: string; avatar?: string; notificationPreferences?: any }
  ): Promise<IUser> {
    const updatedUser = await userRepository.updateById(userId, updateData);
    if (!updatedUser) {
      throw ApiError.notFound("User not found.");
    }
    return updatedUser;
  }

  // Address CRUD
  public async getAddresses(userId: string): Promise<IAddress[]> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");
    return user.addresses || [];
  }

  public async addAddress(userId: string, addressData: IAddress): Promise<IAddress[]> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");

    if (addressData.isDefault || user.addresses.length === 0) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
      addressData.isDefault = true;
    }

    user.addresses.push(addressData);
    await user.save();
    return user.addresses;
  }

  public async updateAddress(userId: string, addressId: string, addressData: Partial<IAddress>): Promise<IAddress[]> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");

    const address = (user.addresses as any).id(addressId);
    if (!address) throw ApiError.notFound("Address not found.");

    if (addressData.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    Object.assign(address, addressData);
    await user.save();
    return user.addresses;
  }

  public async deleteAddress(userId: string, addressId: string): Promise<IAddress[]> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");

    (user.addresses as any).pull({ _id: addressId });
    await user.save();
    return user.addresses;
  }

  public async setDefaultAddress(userId: string, addressId: string): Promise<IAddress[]> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");

    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id?.toString() === addressId;
    });

    await user.save();
    return user.addresses;
  }

  // Wishlist CRUD
  public async getWishlist(userId: string): Promise<any> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");
    await user.populate("wishlist");
    return (user.wishlist || []).filter(Boolean);
  }

  public async addToWishlist(userId: string, productId: string): Promise<any> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");

    let product = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await productRepository.findById(productId);
    }
    if (!product) {
      product = await productRepository.findBySlug(productId);
    }
    if (!product) throw ApiError.notFound("Product not found.");

    const targetIdStr = product._id.toString();
    const exists = user.wishlist.some((id: any) => {
      if (!id) return false;
      const idStr = id._id ? id._id.toString() : id.toString();
      return idStr === targetIdStr;
    });

    if (!exists) {
      user.wishlist.push(product._id);
      await user.save();
    }
    await user.populate("wishlist");
    return (user.wishlist || []).filter(Boolean);
  }

  public async removeFromWishlist(userId: string, productId: string): Promise<any> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");

    let targetIdStr = productId;
    let product = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await productRepository.findById(productId);
    }
    if (!product) {
      product = await productRepository.findBySlug(productId);
    }
    if (product) {
      targetIdStr = product._id.toString();
    }

    user.wishlist = (user.wishlist || []).filter((id: any) => {
      if (!id) return false;
      const rawId = id._id ? id._id.toString() : id.toString();
      const slug = id.slug;
      return rawId !== targetIdStr && rawId !== productId && slug !== productId;
    });

    await user.save();
    await user.populate("wishlist");
    return (user.wishlist || []).filter(Boolean);
  }

  public async clearWishlist(userId: string): Promise<any> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");

    user.wishlist = [];
    await user.save();
    return [];
  }

  // Payment Methods CRUD
  public async getPaymentMethods(userId: string): Promise<IPaymentMethod[]> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");
    return user.paymentMethods || [];
  }

  public async addPaymentMethod(userId: string, methodData: IPaymentMethod): Promise<IPaymentMethod[]> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");

    if (methodData.isDefault || user.paymentMethods.length === 0) {
      user.paymentMethods.forEach((pm) => (pm.isDefault = false));
      methodData.isDefault = true;
    }

    user.paymentMethods.push(methodData);
    await user.save();
    return user.paymentMethods;
  }

  public async deletePaymentMethod(userId: string, methodId: string): Promise<IPaymentMethod[]> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");

    (user.paymentMethods as any).pull({ _id: methodId });
    await user.save();
    return user.paymentMethods;
  }
}

export const userService = new UserService();
