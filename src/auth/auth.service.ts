import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserDTO } from './DTO';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(readonly prismaService: PrismaService) {}
  generateHash(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
  async signUp(user: UserDTO) {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (userExist)
      throw new ForbiddenException(
        'User already exists, try using another email',
      );

    const newUser = await this.prismaService.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: this.generateHash(user.password),
      },
    });
    const message = 'User has been created successfully';

    delete newUser.password;

    return { message, newUser };
  }
}
