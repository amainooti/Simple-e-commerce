import {
  Body,
  Controller,
  Request,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { jwtAuthGuard } from '../auth/guard';
import { CreateProductDTO } from './DTO';
import { UpdateProductDTO } from './DTO';

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
      userId,
    };
    return this.productService.createProduct(product);
  }

  @UseGuards(jwtAuthGuard)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) productId: number, @Request() req) {
    const userId = req.user.id;
    return this.productService.getById({ productId, userId });
  }

  @UseGuards(jwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: UpdateProductDTO,
    @Request() req,
  ) {
    const userId = req.user.id;
    const updatedProduct = {
      ...dto,
      userId,
    };
    return this.productService.updateProduct(
      { productId, userId },
      updatedProduct,
    );
  }
}
