import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDTO,
  ForgotPasswordDTO,
  LoginUserDTO,
  ResetPasswordDTO,
} from './DTO';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() user: CreateUserDTO) {
    return this.authService.signUp(user);
  }

  @Post('sign-in')
  signIn(@Body() user: LoginUserDTO) {
    return this.authService.signIn(user);
  }
  @Post('forgot-password')
  forgotPassword(@Body() email) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() { token, newPassword }: ResetPasswordDTO) {
    try {
      await this.authService.resetPassword(token, newPassword);
      return { message: 'Password has been successfully reset' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
