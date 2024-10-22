import { Module } from '@nestjs/common';
import { PaymentgatewayService } from './paymentgateway.service';
import { PaymentgatewayController } from './paymentgateway.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PaymentgatewayController],
  providers: [PaymentgatewayService, PrismaService],
})
export class PaymentgatewayModule {}
