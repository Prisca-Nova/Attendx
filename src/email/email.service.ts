import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
type emailData = {
  to: string;
  subject: string;
  body: string;
  template: string;
  context: object;
};
@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(data: emailData): Promise<void> {
    data.context = { ...data.context, year: new Date().getFullYear() };
    this.mailerService.sendMail(data);
  }
}
