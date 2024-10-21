import { Optional } from '@nestjs/common';
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
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  userId: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  category: string;

  @MinLength(5)
  @Optional()
  @IsNotEmpty()
  description?: string;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsArray()
  @IsOptional()
  imageUrl?: string[];
}
