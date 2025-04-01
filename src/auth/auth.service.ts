import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  ForgotPasswordDto,
  InviteUserDto,
  LoginDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  ResetPasswordDto,
  VerifyAccountDto,
} from './dto/auth.dto';
import { User, UserStatus } from '../user/entities/user.entity';
import { UserService } from 'src/user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from '../config/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OTP } from './entities/otp.entity';
import { DateTime } from 'luxon';
import { OTPRepository } from './repositories/otp.repository';
import { EmailService } from '../email/email.service';
import { EmailTemplateType } from '../email/enumeration/email-template';
import { InvitationRepository } from './repositories/invitation.repository';
import { Invitation, InvitationStatus } from './entities/invitation.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly appConfig: AppConfig,
    private readonly OtpRepository: OTPRepository,
    private readonly emailService: EmailService,
    private readonly invitationRepository: InvitationRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  async authenticate(data: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByEmail(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const inactiveStatuses: UserStatus[] = [
      UserStatus.INACTIVE,
      UserStatus.DELETED,
      UserStatus.EXPIRED,
      UserStatus.PENDING_SUSPENSION,
      UserStatus.SUSPENDED,
    ];

    if (inactiveStatuses.includes(user.status)) {
      const statusMessages: Record<UserStatus, string> = {
        [UserStatus.INACTIVE]: 'User account is not active',
        [UserStatus.DELETED]: 'User account is not active',
        [UserStatus.EXPIRED]: 'User account is not active',
        [UserStatus.PENDING_SUSPENSION]: 'User account is on hold',
        [UserStatus.SUSPENDED]: 'User account is suspended',
        [UserStatus.ACTIVE]: '',
        [UserStatus.PENDING_VERIFICATION]: 'Account not active yet',
      };
      throw new BadRequestException(
        statusMessages[user.status] || 'Invalid user status',
      );
    }

    const [accessToken, refreshToken, userDetails] = await Promise.all([
      this.jwtService.signAsync({ sub: user.id }),
      this.jwtService.signAsync(
        { sub: user.id },
        { expiresIn: this.appConfig.jwtRefreshTokenExpiryTime },
      ),
      this.userService.getUserById(user.id),
    ]);

    await this.cacheManager.set(`user:${user.id}`, userDetails, 300000);
    const loginResponseDto: LoginResponseDto = {
      accessToken,
      refreshToken,
    };
    return loginResponseDto;
  }
  async refresh(dto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    // Refresh JWT tokens
    return {
      accessToken: 'new_access_token',
    };
  }
  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {}
  async resetPassword(dto: ResetPasswordDto): Promise<void> {}
  isOTPExpired(otp: OTP): boolean {
    const expirationTime = DateTime.fromJSDate(otp.createdAt).plus({
      minutes: this.appConfig.otpExpiry,
    });
    return DateTime.now() > expirationTime && otp.isActive;
  }
  async verifyAccount(verifyAccountDto: VerifyAccountDto): Promise<void> {
    const otp = await this.validateOtp(verifyAccountDto.otp);
    console.log('Here', otp);

    if (otp.user) {
      await this.verifyUserAccount(otp.user, verifyAccountDto.password);
    } else if (otp.invitation) {
      await this.createUserFromInvitation(
        otp.invitation,
        verifyAccountDto.password,
      );
    }
    otp.isActive = false;
    this.OtpRepository.save(otp);
  }

  async validateOtp(otpValue: string): Promise<OTP> {
    const otp = await this.OtpRepository.findOne({
      where: { otp: otpValue, isActive: true },
      relations: ['user', 'invitation'],
    });
    if (!otp) {
      throw new BadRequestException('Invalid OTP');
    }
    if (this.isOTPExpired(otp)) {
      throw new BadRequestException('Expired OTP');
    }
    return otp;
  }

  private async verifyUserAccount(user: User, password: string): Promise<void> {
    await this.userService.setPassword(user, password);
  }

  private async createUserFromInvitation(
    invitation: Invitation,
    password: string,
  ): Promise<void> {
    const user = new User();
    user.firstName = invitation.firstName;
    user.lastName = invitation.lastName;
    user.role = invitation.role;
    user.status = UserStatus.ACTIVE;
    user.email = invitation.email;
    invitation.status = InvitationStatus.ACCEPTED;
    await Promise.all([
      this.userService.createUser(user),
      this.userService.setPassword(user, password),
      this.invitationRepository.save(invitation),
    ]);
  }
  async sendInvite(inviteUserDto: InviteUserDto): Promise<void> {
    await this.validateEmail(inviteUserDto.email);
    let invitation = await this.invitationRepository.findOneByEmail(
      inviteUserDto.email,
    );
    if (!invitation) {
      invitation = this.invitationRepository.create({
        email: inviteUserDto.email,
        firstName: inviteUserDto.firstName,
        lastName: inviteUserDto.lastName,
        role: inviteUserDto.role,
      });

      invitation = await this.invitationRepository.save(invitation);
    }
    const otpInstance = await this.OtpRepository.findOneBy({
      invitation: { id: invitation.id },
    });
    if (otpInstance) {
      otpInstance.isActive = false;
      this.OtpRepository.save(otpInstance);
    }
    const otp = this.OtpRepository.create({
      otp: Math.floor(Math.random() * 100000).toString(),
      invitation: invitation,
    });
    await this.OtpRepository.save(otp);
    this.emailService.sendEmail({
      to: invitation.email,
      subject: 'Attend X - Welcome! Attend X',
      body: null,
      template: EmailTemplateType.EMAIL_VERIFICATION,
      context: {
        otp: otp,
      },
    });
  }

  private async validateEmail(email: string): Promise<void> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return;
    }
    throw new BadRequestException('Email already exists');
  }
}
