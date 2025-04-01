import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AppConfig } from '../config/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [AppConfig],
      useFactory: (dbConfig: AppConfig) => ({
        transport: {
          host: dbConfig.mailHost,
          port: dbConfig.mailPort,
          auth: {
            user: dbConfig.mailUser,
            pass: dbConfig.mailPassword,
          },
        },
        defaults: {
          from: dbConfig.mailUser,
        },
        template: {
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
