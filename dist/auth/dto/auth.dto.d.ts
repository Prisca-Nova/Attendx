import { UserRole } from '../../user/entities/user.entity';
export declare class InviteUserDto {
    role: UserRole;
    firstName: string;
    lastName: string;
    email: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class LoginResponseDto {
    accessToken: string;
    refreshToken: string;
}
export declare class RefreshTokenRequestDto {
    accessToken: string;
}
export declare class RefreshTokenResponseDto {
    accessToken: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    password: string;
}
export declare class VerifyAccountDto {
    otp: string;
    password: string;
}
export declare class VerifyOTPDto {
    otp: string;
}
