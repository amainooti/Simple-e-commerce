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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { jwtAuthGuard } from '../auth/guard';
import { CreateProductDTO } from './DTO';
import { UpdateProductDTO } from './DTO';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  version: '1',
  path: 'products',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(jwtAuthGuard)
  @UseInterceptors(FileInterceptor('image')) // Single file upload
  @Post()
  async create(
    @Body() dto: CreateProductDTO,
    @Request() req,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Image file must be provided.');
    }

    const userId = req.user.id;
    const product = {
      ...dto,
      userId,
    };

    return this.productService.createProduct(product, image);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.getById(productId);
  }

  @Get()
  getAll() {
    return this.productService.getAll();
  }

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
