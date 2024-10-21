import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDTO } from './DTO';
import { Validation } from './validation/Validation';
import { UpdateProductDTO } from './DTO/UpdateProductDTO';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  readonly logger = new Logger(ProductService.name);
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getById(productId: number) {
    try {
      const product = await this.prismaService.product.findFirst({
        where: {
          id: productId,
        },
      });

      Validation.isNotExist(
        product,
        `Product with ID ${productId} was not found or does not belong to you.`,
      );

      return { message: 'Successful', product };
    } catch (error) {
      this.logger.error(
        `Error retrieving product with ID ${productId}`,
        error.stack,
      );
      throw new NotFoundException('Product not found or permission denied');
    }
  }

  async getAll(value?: string) {
    try {
      const products = await this.prismaService.product.findMany({
        where: value
          ? {
              OR: [
                {
                  title: {
                    contains: value,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: value,
                    mode: 'insensitive',
                  },
                },
                {
                  category: {
                    contains: value,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {},
      });

      if (!products) throw new NotFoundException('Products not found');
      return products;
    } catch (error) {
      throw error;
    }
  }
  async createProduct(
    productDto: CreateProductDTO,
    image: Express.Multer.File,
  ) {
    try {
      const folder = `products/${productDto.category}`;
      this.logger.log(
        `Attempting to upload image to Cloudinary in folder: ${folder}`,
      );

      this.logger.log('Attempting to upload image to Cloudinary');
      const cloudinaryResponse =
        await this.cloudinaryService.uploadImage(image);
      this.logger.log(
        'Image uploaded successfully',
        cloudinaryResponse.secure_url,
      );

      const product = await this.prismaService.product.create({
        data: {
          title: productDto.title,
          category: productDto.category,
          description: productDto.description,
          price: productDto.price,
          userId: productDto.userId,
          imageUrl: [cloudinaryResponse.secure_url],
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
