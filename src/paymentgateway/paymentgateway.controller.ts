import { Controller } from '@nestjs/common';
import { PaymentgatewayService } from './paymentgateway.service';

@Controller('paymentgateway')
export class PaymentgatewayController {
  constructor(private readonly paymentgatewayService: PaymentgatewayService) {}
}
