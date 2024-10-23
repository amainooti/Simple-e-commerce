import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { sendMail } from './types';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailingService {
  constructor(private readonly config: ConfigService) {}

  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.config.get('SMTP_USERNAME'),
        pass: this.config.get('SMTP_PASSWORD'),
      },
    });

    return transporter;
  }

  // Load email template from a file
  loadTemplate(templateName: string): string {
    const filePath = path.join(
      process.cwd(),
      'dist',
      'templates',
      `${templateName}.html`,
    );
    return fs.readFileSync(filePath, 'utf8');
  }

  // Compile template with Handlebars or any other engine
  compileTemplate(template: string, replacement: Record<string, any>) {
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(replacement);
  }

  async sendMail(mail: sendMail) {
    const { subject, from, recipient } = mail;

    // Load the template by name
    const html = mail.placeholderReplacement
      ? this.compileTemplate(
          this.loadTemplate(mail.templateName),
          mail.placeholderReplacement,
        )
      : mail.html;

    const transport = this.mailTransport();
    const options: Mail.Options = {
      from: from ?? {
        name: this.config.get('APP_NAME'),
        address: this.config.get('DEFAULT_MAIL_FROM'),
      },
      to: recipient,
      subject,
      html,
      attachments: mail.attachments ?? [],
    };

    try {
      const result = await transport.sendMail(options);
      return result;
    } catch (error) {
      console.error('Error sending email: ', error);
      throw new Error('Email sending failed');
    }
  }
}
