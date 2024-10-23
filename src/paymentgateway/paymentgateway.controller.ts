import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpStatus,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PaymentgatewayService } from './paymentgateway.service';
import { jwtAuthGuard } from '../auth/guard';

@Controller({
  path: 'paymentgateway',
  version: '1',
})
export class PaymentgatewayController {
  constructor(private readonly paymentgatewayService: PaymentgatewayService) {}

  @UseGuards(jwtAuthGuard)
  @Post('initialize')
  async initializePayment(@Request() req, @Body('cartId') cartId: number) {
    try {
      const userId = req.user.id;
      console.log(userId);
      const payment = await this.paymentgatewayService.initializePayment(
        userId,
        cartId,
      );
      return {
        status: HttpStatus.OK,
        message: 'Payment initialized successfully',
        data: payment,
      };
    } catch (error) {
      throw error; // Let NestJS handle HttpExceptions
    }
  }

  @Get('verify/:reference')
  async verifyPayment(@Param('reference') reference: string) {
    try {
      const verificationResult =
        await this.paymentgatewayService.verifyPayment(reference);
      return {
        status: HttpStatus.OK,
        ...verificationResult,
      };
    } catch (error) {
      throw error; // Let NestJS handle HttpExceptions
    }
  }

  @Get('cart-total')
  async getCartTotal(@Query('cartId') cartId: number) {
    try {
      const total = await this.paymentgatewayService.calculateCartTotal(cartId);
      return {
        status: HttpStatus.OK,
        message: 'Cart total calculated successfully',
        data: { total },
      };
    } catch (error) {
      throw error; // Let NestJS handle HttpExceptions
    }
  }
}
