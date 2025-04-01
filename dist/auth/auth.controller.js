"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_dto_1 = require("./dto/auth.dto");
const http_response_1 = require("../common/dto/http-response");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        return http_response_1.HttpResponse.success(await this.authService.authenticate(loginDto), 'Login successful');
    }
    async refresh(refreshTokenRequestDto) {
        return http_response_1.HttpResponse.success(await this.authService.refresh(refreshTokenRequestDto), 'Refresh successful');
    }
    async forgotPassword(data) {
        await this.authService.forgotPassword(data);
        return http_response_1.HttpResponse.success(null, 'Password reset email sent');
    }
    async resetPassword() {
        return http_response_1.HttpResponse.success(null, 'Password reset successful');
    }
    async verifyUserAccount(verifyAccountDto) {
        await this.authService.verifyAccount(verifyAccountDto);
        return http_response_1.HttpResponse.success(null, 'Account verification successful');
    }
    async inviteUser(inviteUserDto) {
        await this.authService.sendInvite(inviteUserDto);
        return http_response_1.HttpResponse.success(null, 'Invite user');
    }
    async resendInvitation(inviteUserDto) {
        await this.authService.sendInvite(inviteUserDto);
        return http_response_1.HttpResponse.success(null, 'Resent invitation');
    }
    async verifyOTP(verifyOTPDto) {
        await this.authService.validateOtp(verifyOTPDto.otp);
        return http_response_1.HttpResponse.success(null, 'OTP verified');
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ operationId: 'login', summary: 'Login' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: auth_dto_1.LoginResponseDto,
        description: 'Login successful',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ operationId: 'refresh', summary: 'Refresh' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: auth_dto_1.RefreshTokenResponseDto,
        description: 'Refresh successful',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RefreshTokenRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ operationId: 'forgot-password', summary: 'Forgot password' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ operationId: 'reset-password', summary: 'Reset password' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('verify-account'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ operationId: 'verify-account', summary: 'Verify account' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Account verification successful',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.VerifyAccountDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyUserAccount", null);
__decorate([
    (0, common_1.Post)('invite-user'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ operationId: 'Invite user', summary: 'Invite user' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Invite user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.InviteUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "inviteUser", null);
__decorate([
    (0, common_1.Post)('resend-invitation'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        operationId: 'Resend invitation',
        summary: 'Resend invitation',
    }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Resend invitation' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.InviteUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendInvitation", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ operationId: 'verify-otp', summary: 'Verify OTP' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Verify OTP' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.VerifyOTPDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOTP", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map