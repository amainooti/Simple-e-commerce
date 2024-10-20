import { Module } from '@nestjs/common';
import { PaymentgatewayService } from './paymentgateway.service';
import { PaymentgatewayController } from './paymentgateway.controller';

@Module({
  controllers: [PaymentgatewayController],
  providers: [PaymentgatewayService],
})
export class PaymentgatewayModule {}
