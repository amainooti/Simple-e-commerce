import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDTO } from './DTO';
import { Validation } from './validation/Validation';

@Injectable()
export class ProductService {
  readonly logger = new Logger(ProductService.name);
  constructor(private prismaService: PrismaService) {}

  async getById(productId: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: {
          id: productId,
        },
      });
      Validation.isNotExist(product, `Product of ${productId} was not found.`);

      return { message: 'Successful', product };
    } catch (error) {
      this.logger.error(
        `Error retrieving product with ID ${productId}`,
        error.stack,
      );
      throw error;
    }
  }

  async createProduct(productDto: CreateProductDTO) {
    try {
      const product = await this.prismaService.product.create({
        data: {
          title: productDto.title,
          category: productDto.category,
          description: productDto.description,
          price: productDto.price,
          userId: productDto.userId,
        },
      });

      Validation.isNotExist(product, `${product} not found`);

      return { message: 'successfully created', product };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
