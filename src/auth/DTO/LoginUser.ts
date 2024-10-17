import { CreateUserDTO } from './CreateUser';
import { PickType } from '@nestjs/mapped-types';

export class LoginUserDTO extends PickType(CreateUserDTO, [
  'email',
  'password',
] as const) {}
