import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDTO } from './CreateProductDTO';

export class UpdateProductDTO extends PartialType(CreateProductDTO) {}
