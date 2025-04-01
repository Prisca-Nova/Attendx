import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../../user/entities/user.entity';
import { AppConfig } from '../../config/config';

export class InviteUserDto {
  @ApiProperty({
    enum: [UserRole.COMPANY, UserRole.CLIENT],
    enumName: 'InvitableUserRole',
    default: UserRole.CLIENT,
  })
  @IsEnum(UserRole)
  role: UserRole;
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}
export class RefreshTokenRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  accessToken: string;
}
export class RefreshTokenResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  accessToken: string;
}
export class ForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class VerifyAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  otp: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword(AppConfig.passwordStrictOptions)
  password: string;
}

export class VerifyOTPDto {
  @ApiProperty()
  @IsNotEmpty()
  otp: string;
}
