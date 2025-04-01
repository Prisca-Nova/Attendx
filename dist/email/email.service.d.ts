import { MailerService } from '@nestjs-modules/mailer';
type emailData = {
    to: string;
    subject: string;
    body: string;
    template: string;
    context: object;
};
export declare class EmailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendEmail(data: emailData): Promise<void>;
}
export {};
