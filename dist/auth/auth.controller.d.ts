import { ForgotPasswordDto, InviteUserDto, LoginDto, LoginResponseDto, RefreshTokenRequestDto, RefreshTokenResponseDto, VerifyAccountDto, VerifyOTPDto } from './dto/auth.dto';
import { HttpResponse } from '../common/dto/http-response';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<HttpResponse<LoginResponseDto>>;
    refresh(refreshTokenRequestDto: RefreshTokenRequestDto): Promise<HttpResponse<RefreshTokenResponseDto>>;
    forgotPassword(data: ForgotPasswordDto): Promise<HttpResponse<null>>;
    resetPassword(): Promise<HttpResponse<null>>;
    verifyUserAccount(verifyAccountDto: VerifyAccountDto): Promise<HttpResponse<null>>;
    inviteUser(inviteUserDto: InviteUserDto): Promise<HttpResponse<null>>;
    resendInvitation(inviteUserDto: InviteUserDto): Promise<HttpResponse<null>>;
    verifyOTP(verifyOTPDto: VerifyOTPDto): Promise<HttpResponse<null>>;
}
