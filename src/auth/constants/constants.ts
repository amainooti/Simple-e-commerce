import { ConfigService } from '@nestjs/config';

// Improve on the security of the secret
export const jwtConstants = {
  secret: new ConfigService().get<string>('SECRET'),
};
