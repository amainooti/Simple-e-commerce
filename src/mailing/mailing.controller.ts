import { Body, Controller, Post } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { sendMail } from './types';

@Controller('mailing')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @Post('/send-email')
  async sendMail(@Body() body: Record<string, string>) {
    const mail: sendMail = {
      // from: { name: 'cetpower', address: 'cetpower@mail.power.com' },
      recipient: [{ name: 'Amaino Oti', address: 'amainooti@egmail.com' }],
      subject: 'Welcome aboard',
      templateName: 'welcome', // Use a template file called welcome.html
      placeholderReplacement: body,
    };
    return this.mailingService.sendMail(mail);
  }
}
