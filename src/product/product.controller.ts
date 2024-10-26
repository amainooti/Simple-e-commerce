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
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { jwtAuthGuard } from '../auth/guard';
import { CreateProductDTO } from './DTO';
import { UpdateProductDTO } from './DTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller({
  version: '1',
  path: 'products',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //TODO: Change the single file upload to multiple file upload
  @UseGuards(jwtAuthGuard)
  @ApiBearerAuth()
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
  @ApiQuery({
    name: 'product',
    required: false,
    description: 'Product name to filter by (optional)',
  })
  getAll(@Query('product') product?: string) {
    return this.productService.getAll(product);
  }

  @Patch(':id')
  @ApiBearerAuth()
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
