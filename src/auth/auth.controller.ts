import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ForgotPasswordDto,
  InviteUserDto,
  LoginDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  VerifyAccountDto,
  VerifyOTPDto,
} from './dto/auth.dto';
import { HttpResponse } from '../common/dto/http-response';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'login', summary: 'Login' })
  @ApiResponse({
    status: 200,
    type: LoginResponseDto,
    description: 'Login successful',
  })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<HttpResponse<LoginResponseDto>> {
    return HttpResponse.success(
      await this.authService.authenticate(loginDto),
      'Login successful',
    );
  }
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'refresh', summary: 'Refresh' })
  @ApiResponse({
    status: 200,
    type: RefreshTokenResponseDto,
    description: 'Refresh successful',
  })
  async refresh(
    @Body() refreshTokenRequestDto: RefreshTokenRequestDto,
  ): Promise<HttpResponse<RefreshTokenResponseDto>> {
    return HttpResponse.success(
      await this.authService.refresh(refreshTokenRequestDto),
      'Refresh successful',
    );
  }
  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ operationId: 'forgot-password', summary: 'Forgot password' })
  async forgotPassword(data: ForgotPasswordDto): Promise<HttpResponse<null>> {
    await this.authService.forgotPassword(data);
    return HttpResponse.success(null, 'Password reset email sent');
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ operationId: 'reset-password', summary: 'Reset password' })
  async resetPassword(): Promise<HttpResponse<null>> {
    return HttpResponse.success(null, 'Password reset successful');
  }
  @Post('verify-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'verify-account', summary: 'Verify account' })
  @ApiResponse({
    status: 200,
    description: 'Account verification successful',
  })
  async verifyUserAccount(
    @Body() verifyAccountDto: VerifyAccountDto,
  ): Promise<HttpResponse<null>> {
    await this.authService.verifyAccount(verifyAccountDto);
    return HttpResponse.success(null, 'Account verification successful');
  }

  @Post('invite-user')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'Invite user', summary: 'Invite user' })
  @ApiResponse({ status: 204, description: 'Invite user' })
  async inviteUser(
    @Body() inviteUserDto: InviteUserDto,
  ): Promise<HttpResponse<null>> {
    await this.authService.sendInvite(inviteUserDto);
    return HttpResponse.success(null, 'Invite user');
  }
  @Post('resend-invitation')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(AuthGuard)
  @ApiOperation({
    operationId: 'Resend invitation',
    summary: 'Resend invitation',
  })
  @ApiResponse({ status: 204, description: 'Resend invitation' })
  async resendInvitation(
    @Body() inviteUserDto: InviteUserDto,
  ): Promise<HttpResponse<null>> {
    await this.authService.sendInvite(inviteUserDto);
    return HttpResponse.success(null, 'Resent invitation');
  }
  @Post('verify-otp')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(AuthGuard)
  @ApiOperation({ operationId: 'verify-otp', summary: 'Verify OTP' })
  @ApiResponse({ status: 204, description: 'Verify OTP' })
  async verifyOTP(
    @Body() verifyOTPDto: VerifyOTPDto,
  ): Promise<HttpResponse<null>> {
    await this.authService.validateOtp(verifyOTPDto.otp);
    return HttpResponse.success(null, 'OTP verified');
  }
}
