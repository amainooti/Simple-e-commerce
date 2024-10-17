import Mail, { Address } from 'nodemailer/lib/mailer';

export type sendMail = {
  from?: Address;
  recipient: Address[];
  subject: string;
  html?: string;
  text?: string;
  templateName?: string;
  attachments?: Mail.Attachment[];
  placeholderReplacement?: Record<string, string>;
};
