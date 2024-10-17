import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from './DTO';

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
}
