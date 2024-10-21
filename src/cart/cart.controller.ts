import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { User } from '../auth/decorators';
import { jwtAuthGuard } from '../auth/guard';

@Controller({
  version: '1',
  path: 'cart',
})
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(
    @User('id') userId: number,
    @Body('productId', ParseIntPipe) productId: number,
    @Body('quantity', ParseIntPipe) quantity: number = 1,
  ) {
    return this.cartService.addToCart(+userId, productId, quantity);
  }

  @UseGuards(jwtAuthGuard)
  startCheckout(@Body('cartId') cartId: number) {
    return this.cartService.startCheckout(cartId);
  }

  @UseGuards(jwtAuthGuard)
  completeCheckout(@Body('cartId') cartId: number) {
    return this.cartService.completeCheckout(cartId);
  }

  @UseGuards(jwtAuthGuard)
  saveForLater(@Body('cartItemId') cartItemId: number) {
    return this.cartService.saveForLater(cartItemId);
  }

  @UseGuards(jwtAuthGuard)
  getActiveCartItems(@Body() cartId: number) {
    return this.cartService.getActiveCartItems(cartId);
  }
}
