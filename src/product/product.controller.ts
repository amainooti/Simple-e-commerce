import {
  Body,
  Controller,
  Request,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './DTO';
import { jwtAuthGuard } from '../auth/guard';

@Controller({
  version: '1',
  path: 'products',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(jwtAuthGuard)
  @Post()
  create(@Body() dto: CreateProductDTO, @Request() req) {
    const userId = req.user.id;
    const product = {
      ...dto,
      userId: userId,
    };
    return this.productService.createProduct(product);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.getById(productId);
  }
}
