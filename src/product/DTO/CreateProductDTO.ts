import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDTO {
  @ApiProperty({ description: 'The title of the product', minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'ID of the user creating the product',
    example: 1,
  })
  userId: number;

  @ApiProperty({ description: 'Product category', minLength: 5 })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  category: string;

  @ApiProperty({
    description: 'Product description',
    required: false,
    minLength: 5,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  description?: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 0.0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({
    description: 'Array of image URLs for the product',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  imageUrl?: string[];
}
