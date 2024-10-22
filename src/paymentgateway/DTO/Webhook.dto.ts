export class InitiatePaymentDto {
  cartId: number;
}

export class WebhookDto {
  event: string;
  data: {
    reference: string;
    status: string;
    gateway_response: string;
    paid_at: string;
    amount: number;
    channel: string;
    metadata: {
      cartId: number;
      userId: number;
    };
  };
}
