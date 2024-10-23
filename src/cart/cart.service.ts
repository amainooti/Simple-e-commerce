import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartStatus } from '@prisma/client';
import { cartItem } from './DTO/cart-item';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  async addToCart(userId: number, productId: number, quantity: number = 1) {
    // First, get or create the user's cart
    let cart = await this.prismaService.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prismaService.cart.create({
        data: { userId },
      });
    }

    // Check if the item is already in the cart
    const existingItem = await this.prismaService.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        status: CartStatus.ACTIVE,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      return this.prismaService.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Create new cart item if it doesn't exist
      return this.prismaService.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          status: CartStatus.ACTIVE,
        },
      });
    }
  }

  async startCheckout(cartId: number) {
    // Update all active items in the cart to CHECKOUT_IN_PROGRESS
    return this.prismaService.cartItem.updateMany({
      where: {
        cartId,
        status: CartStatus.ACTIVE,
      },
      data: { status: CartStatus.CHECKOUT_IN_PROGRESS },
    });
  }

  async completeCheckout(cartId: number) {
    // Update all items in checkout to COMPLETED
    return this.prismaService.cartItem.updateMany({
      where: {
        cartId,
        status: CartStatus.CHECKOUT_IN_PROGRESS,
      },
      data: { status: CartStatus.COMPLETED },
    });
  }

  async saveForLater(cartItemId: number) {
    // Mark an item as ABANDONED (saved for later)
    return this.prismaService.cartItem.update({
      where: { id: cartItemId },
      data: { status: CartStatus.ABANDONED },
    });
  }

  async getActiveCartItems(cart: cartItem) {
    return this.prismaService.cartItem.findMany({
      where: {
        cartId: cart.cartId,
        status: CartStatus.ACTIVE,
      },
    });
  }
}
