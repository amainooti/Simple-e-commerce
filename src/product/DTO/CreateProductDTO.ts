import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

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
  @IsNotEmpty()
  price: number;
}
