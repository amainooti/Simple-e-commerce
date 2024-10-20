import { Controller } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller({
  version: '1',
  path: 'carts',
})
export class CartController {
  constructor(private readonly cartService: CartService) {}
}
