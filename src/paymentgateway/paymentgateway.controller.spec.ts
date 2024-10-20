import { Test, TestingModule } from '@nestjs/testing';
import { PaymentgatewayController } from './paymentgateway.controller';
import { PaymentgatewayService } from './paymentgateway.service';

describe('PaymentgatewayController', () => {
  let controller: PaymentgatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentgatewayController],
      providers: [PaymentgatewayService],
    }).compile();

    controller = module.get<PaymentgatewayController>(PaymentgatewayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
