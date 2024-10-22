import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentgatewayService {
  private readonly baseUrl = 'https://api.paystack.co';
  private readonly secretKey: string;

  constructor(private prisma: PrismaService) {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!this.secretKey) {
      throw new Error('PAYSTACK_SECRET_KEY is not defined');
    }
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  async calculateCartTotal(cartId: number): Promise<number> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cartId,
        status: 'ACTIVE',
      },
      include: {
        product: true,
      },
    });

    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  async initializePayment(userId: number, cartId: number) {
    // Verify cart belongs to user
    const cart = await this.prisma.cart.findFirst({
      where: {
        id: cartId,
        userId,
      },
      include: {
        user: true,
        cartItems: {
          where: { status: 'ACTIVE' },
          include: { product: true },
        },
      },
    });

    if (!cart) {
      throw new HttpException('Cart not found', 404);
    }

    const amount = await this.calculateCartTotal(cartId);
    const reference = `TXN-${randomUUID()}`;

    // Create transaction record
    const transaction = await this.prisma.transaction.create({
      data: {
        amount,
        reference,
        status: 'PENDING',
        cartId,
        metadata: {
          cartItems: cart.cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Update cart items status
    await this.prisma.cartItem.updateMany({
      where: { cartId },
      data: { status: 'CHECKOUT_IN_PROGRESS' },
    });

    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          amount: amount * 100, // Convert to kobo
          email: cart.user.email,
          reference: transaction.reference,
          callback_url: `${process.env.APP_URL}/payment/verify`,
          metadata: {
            cartId,
            userId,
          },
        },
        { headers: this.getHeaders() },
      );

      return {
        paymentUrl: response.data.data.authorization_url,
        reference: transaction.reference,
      };
    } catch (error) {
      // Revert cart items status on failure
      await this.prisma.cartItem.updateMany({
        where: { cartId },
        data: { status: 'ACTIVE' },
      });

      throw new HttpException(
        error.response?.data?.message || 'Payment initialization failed',
        error.response?.status || 500,
      );
    }
  }

  async verifyPayment(reference: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { reference },
      include: {
        cart: {
          include: {
            cartItems: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new HttpException('Transaction not found', 404);
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        { headers: this.getHeaders() },
      );

      const paymentData = response.data.data;

      if (paymentData.status === 'success') {
        // Update transaction
        await this.prisma.transaction.update({
          where: { reference },
          data: {
            status: 'COMPLETED',
            paystackRef: paymentData.reference,
            paymentMethod: paymentData.channel,
          },
        });

        // Update cart items status
        await this.prisma.cartItem.updateMany({
          where: { cartId: transaction.cartId },
          data: { status: 'COMPLETED' },
        });

        return {
          success: true,
          message: 'Payment verified successfully',
          data: paymentData,
        };
      } else {
        // Revert cart items status
        await this.prisma.cartItem.updateMany({
          where: { cartId: transaction.cartId },
          data: { status: 'ACTIVE' },
        });

        await this.prisma.transaction.update({
          where: { reference },
          data: { status: 'FAILED' },
        });

        return {
          success: false,
          message: 'Payment verification failed',
          data: paymentData,
        };
      }
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Payment verification failed',
        error.response?.status || 500,
      );
    }
  }
}
