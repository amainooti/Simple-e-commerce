import { CreateUserDTO } from './CreateUser';
import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDTO extends PickType(CreateUserDTO, [
  'email',
  'password',
] as const) {
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@mail.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'secure-pass12@,ys0#',
  })
  password: string;
}
