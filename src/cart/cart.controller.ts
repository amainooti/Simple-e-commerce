import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { jwtAuthGuard } from '../auth/guard';
import { cartItem } from './DTO/cart-item';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Cart')
@Controller({
  version: '1',
  path: 'cart',
})
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @UseGuards(jwtAuthGuard)
  async addToCart(
    @Body('productId', ParseIntPipe) productId: number,
    @Body('quantity', ParseIntPipe) quantity: number = 1,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.cartService.addToCart(userId, productId, quantity);
  }

  @Post('start-checkout')
  @UseGuards(jwtAuthGuard)
  startCheckout(@Body('cartId') cartId: number) {
    return this.cartService.startCheckout(cartId);
  }

  @Post('complete-checkout')
  @UseGuards(jwtAuthGuard)
  completeCheckout(@Body('cartId') cartId: number) {
    return this.cartService.completeCheckout(cartId);
  }

  @Post('achived')
  @UseGuards(jwtAuthGuard)
  saveForLater(@Body('cartItemId') cartItemId: number) {
    return this.cartService.saveForLater(cartItemId);
  }

  @Post('cart-items')
  @UseGuards(jwtAuthGuard)
  getActiveCartItems(@Body() cartId: cartItem) {
    return this.cartService.getActiveCartItems(cartId);
  }
}
