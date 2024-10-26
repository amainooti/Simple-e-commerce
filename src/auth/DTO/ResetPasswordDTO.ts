import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDTO {
  @ApiProperty({
    description: 'Long string of character that provides auth priveleges',
    example:
      '7b29e1c9ca0d2f4e8212194f9d0a1b66aab07cca9289adb3b8f5b09b7c244832068ededabd6395ff1e084b2bcfff8445',
  })
  token: string;
  @ApiProperty({
    description: 'The new password you want to replace with',
    example: 'new-secure-p@swor3d!',
  })
  newPassword: string;
}
