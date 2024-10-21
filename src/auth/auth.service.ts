import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
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
  private readonly logger = new Logger(AuthService.name);

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
      throw new UnauthorizedException('Password does not match');

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

  // Forgot Password Functionality
  async forgotPassword(emailObj: { email: string }) {
    const email = emailObj.email;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Generate reset token (JWT)
    const resetToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '1h' }, // Token valid for 1 hour
    );

    const resetPasswordUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    this.logger.log('Trying to send token to mail');

    // Send reset password email
    const mail: sendMail = {
      recipient: [{ name: user.name, address: user.email }],
      subject: 'Password Reset',
      templateName: 'reset-password', // Use a template file called reset-password.html
      placeholderReplacement: {
        name: user.name,
        resetLink: resetPasswordUrl,
        resetToken,
      },
    };

    await this.mailService.sendMail(mail);

    this.logger.log('Successfully sent token to mail');

    return {
      message: 'Password reset link sent to your email address',
    };
  }

  // Reset Password Functionality
  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new NotFoundException('Invalid token');
      }

      const hashedPassword = this.generateHash(newPassword);

      await this.prismaService.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return { message: 'Password has been reset successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
