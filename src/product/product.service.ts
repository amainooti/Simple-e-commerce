import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDTO } from './DTO';
import { Validation } from './validation/Validation';
import { UpdateProductDTO } from './DTO/UpdateProductDTO';

@Injectable()
export class ProductService {
  readonly logger = new Logger(ProductService.name);
  constructor(private prismaService: PrismaService) {}

  async getById({ productId, userId }: { productId: number; userId: number }) {
    try {
      const product = await this.prismaService.product.findFirst({
        where: {
          id: productId,
          userId,
        },
      });

      Validation.isNotExist(
        product,
        `Product with ID ${productId} was not found or does not belong to you.`,
      );

      return { message: 'Successful', product };
    } catch (error) {
      this.logger.error(
        `Error retrieving product with ID ${productId} for user ID ${userId}`,
        error.stack,
      );
      throw new NotFoundException('Product not found or permission denied');
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

      return { message: 'Successfully created', product };
    } catch (error) {
      this.logger.error('Error creating product', error.stack);
      throw error;
    }
  }

  async updateProduct(
    { productId, userId }: { productId: number; userId: number },
    productDTO: UpdateProductDTO,
  ) {
    try {
      const productExist = await this.prismaService.product.findFirst({
        where: {
          id: productId,
          userId,
        },
      });

      Validation.isNotExist(
        productExist,
        'Product not found or does not belong to you.',
      );

      const updatedProduct = await this.prismaService.product.update({
        where: { id: productId },
        data: {
          ...productDTO,
        },
      });

      return { message: 'Successfully updated', updatedProduct };
    } catch (error) {
      this.logger.error(
        `Error updating product with ID ${productId} for user ID ${userId}`,
        error.stack,
      );
      throw new NotFoundException(
        'Update failed. Product not found or permission denied.',
      );
    }
  }

  async delete({ productId, userId }: { productId: number; userId: number }) {
    try {
      const productExist = await this.prismaService.product.findFirst({
        where: {
          id: productId,
          userId,
        },
      });

      Validation.isNotExist(
        productExist,
        'Product not found or does not belong to you.',
      );

      await this.prismaService.product.delete({ where: { id: productId } });
      this.logger.log(
        `Product with ID ${productId} deleted successfully by user ID ${userId}`,
      );

      return { message: 'Deleted successfully' };
    } catch (error) {
      this.logger.error(
        `Error deleting product with ID ${productId} for user ID ${userId}`,
        error.stack,
      );
      throw new NotFoundException(
        'Delete failed. Product not found or permission denied.',
      );
    }
  }
}
