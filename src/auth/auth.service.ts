import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDTO, LoginUserDTO } from './DTO';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { MailingService } from '../mailing/mailing.service';
import { sendMail } from '../mailing/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailingService,
  ) {}

  generateHash(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  async signUp(user: CreateUserDTO) {
    try {
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

      const mail: sendMail = {
        recipient: [{ name: newUser.name, address: newUser.email }],
        subject: 'Welcome aboard',
        templateName: 'welcome', // Use a template file called welcome.html
        placeholderReplacement: { name: newUser.name },
      };

      setTimeout(() => {
        this.mailService.sendMail(mail);
      }, 5000);

      return { message, newUser };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exist');
        }
      }
      throw new InternalServerErrorException('Something happened try again.');
    }
  }

  async signIn(user: LoginUserDTO) {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });
    const isPasswordValid = await bcrypt.compare(
      user.password,
      userExist.password,
    );

    if (!userExist) {
      throw new NotFoundException(
        'User does not exist, try a valid email or password',
      );
    }

    if (!isPasswordValid)
      throw new UnauthorizedException('Password does not macth');

    const payload = { sub: userExist.id, email: userExist.email };

    // Generate JWT token
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      user: {
        id: userExist.id,
        email: userExist.email,
        name: userExist.name,
      },
      token,
    };
  }
}
