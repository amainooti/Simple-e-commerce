import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';

@Module({
  providers: [MailingService],
  controllers: [MailingController],
})
export class MailingModule {}
