import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigifyModule } from '@itgorillaz/configify';
import { CacheModule } from '@nestjs/cache-manager';
import { AppConfig } from '../config/config';
import { CommonModule } from '../common/common.module';
import { OTPRepository } from './repositories/otp.repository';
import { EmailModule } from '../email/email.module';
import { InvitationRepository } from './repositories/invitation.repository';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [AppConfig], // Import ConfigModule to access configuration
      inject: [AppConfig], // Inject ConfigService to retrieve config values
      useFactory: async (configService: AppConfig) => ({
        secret: configService.jwtAuthSecret, // Retrieve the secret key
        signOptions: { expiresIn: configService.acessTokenLifeTime }, // Additional options
      }),
      global: true, // Make the module global
    }),
    CommonModule,
    ConfigifyModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, OTPRepository, InvitationRepository],
})
export class AuthModule {}
