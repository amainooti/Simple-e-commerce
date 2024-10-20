import { Test, TestingModule } from '@nestjs/testing';
import { PaymentgatewayService } from './paymentgateway.service';

describe('PaymentgatewayService', () => {
  let service: PaymentgatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentgatewayService],
    }).compile();

    service = module.get<PaymentgatewayService>(PaymentgatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
