import { NotFoundException } from '@nestjs/common';

export class Validation {
  static isNotExist(entity: Record<string, any>, message: string) {
    if (!entity) throw new NotFoundException(message);
  }
}
