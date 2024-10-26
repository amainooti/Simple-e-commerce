import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    description: 'The name of the user',
    minLength: 3,
    maxLength: 50,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'SecureP@ssw0rd',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "The user's email address",
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
