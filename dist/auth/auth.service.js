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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/entities/user.entity");
const user_service_1 = require("../user/service/user.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("../config/config");
const cache_manager_1 = require("@nestjs/cache-manager");
const luxon_1 = require("luxon");
const otp_repository_1 = require("./repositories/otp.repository");
const email_service_1 = require("../email/email.service");
const email_template_1 = require("../email/enumeration/email-template");
const invitation_repository_1 = require("./repositories/invitation.repository");
const invitation_entity_1 = require("./entities/invitation.entity");
let AuthService = AuthService_1 = class AuthService {
    constructor(userService, jwtService, appConfig, OtpRepository, emailService, invitationRepository, cacheManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.appConfig = appConfig;
        this.OtpRepository = OtpRepository;
        this.emailService = emailService;
        this.invitationRepository = invitationRepository;
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async authenticate(data) {
        const user = await this.userService.getUserByEmail(data.email);
        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        const inactiveStatuses = [
            user_entity_1.UserStatus.INACTIVE,
            user_entity_1.UserStatus.DELETED,
            user_entity_1.UserStatus.EXPIRED,
            user_entity_1.UserStatus.PENDING_SUSPENSION,
            user_entity_1.UserStatus.SUSPENDED,
        ];
        if (inactiveStatuses.includes(user.status)) {
            const statusMessages = {
                [user_entity_1.UserStatus.INACTIVE]: 'User account is not active',
                [user_entity_1.UserStatus.DELETED]: 'User account is not active',
                [user_entity_1.UserStatus.EXPIRED]: 'User account is not active',
                [user_entity_1.UserStatus.PENDING_SUSPENSION]: 'User account is on hold',
                [user_entity_1.UserStatus.SUSPENDED]: 'User account is suspended',
                [user_entity_1.UserStatus.ACTIVE]: '',
                [user_entity_1.UserStatus.PENDING_VERIFICATION]: 'Account not active yet',
            };
            throw new common_1.BadRequestException(statusMessages[user.status] || 'Invalid user status');
        }
        const [accessToken, refreshToken, userDetails] = await Promise.all([
            this.jwtService.signAsync({ sub: user.id }),
            this.jwtService.signAsync({ sub: user.id }, { expiresIn: this.appConfig.jwtRefreshTokenExpiryTime }),
            this.userService.getUserById(user.id),
        ]);
        await this.cacheManager.set(`user:${user.id}`, userDetails, 300000);
        const loginResponseDto = {
            accessToken,
            refreshToken,
        };
        return loginResponseDto;
    }
    async refresh(dto) {
        return {
            accessToken: 'new_access_token',
        };
    }
    async forgotPassword(dto) { }
    async resetPassword(dto) { }
    isOTPExpired(otp) {
        const expirationTime = luxon_1.DateTime.fromJSDate(otp.createdAt).plus({
            minutes: this.appConfig.otpExpiry,
        });
        return luxon_1.DateTime.now() > expirationTime && otp.isActive;
    }
    async verifyAccount(verifyAccountDto) {
        const otp = await this.validateOtp(verifyAccountDto.otp);
        console.log('Here', otp);
        if (otp.user) {
            await this.verifyUserAccount(otp.user, verifyAccountDto.password);
        }
        else if (otp.invitation) {
            await this.createUserFromInvitation(otp.invitation, verifyAccountDto.password);
        }
        otp.isActive = false;
        this.OtpRepository.save(otp);
    }
    async validateOtp(otpValue) {
        const otp = await this.OtpRepository.findOne({
            where: { otp: otpValue, isActive: true },
            relations: ['user', 'invitation'],
        });
        if (!otp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        if (this.isOTPExpired(otp)) {
            throw new common_1.BadRequestException('Expired OTP');
        }
        return otp;
    }
    async verifyUserAccount(user, password) {
        await this.userService.setPassword(user, password);
    }
    async createUserFromInvitation(invitation, password) {
        const user = new user_entity_1.User();
        user.firstName = invitation.firstName;
        user.lastName = invitation.lastName;
        user.role = invitation.role;
        user.status = user_entity_1.UserStatus.ACTIVE;
        user.email = invitation.email;
        invitation.status = invitation_entity_1.InvitationStatus.ACCEPTED;
        await Promise.all([
            this.userService.createUser(user),
            this.userService.setPassword(user, password),
            this.invitationRepository.save(invitation),
        ]);
    }
    async sendInvite(inviteUserDto) {
        await this.validateEmail(inviteUserDto.email);
        let invitation = await this.invitationRepository.findOneByEmail(inviteUserDto.email);
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
            template: email_template_1.EmailTemplateType.EMAIL_VERIFICATION,
            context: {
                otp: otp,
            },
        });
    }
    async validateEmail(email) {
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            return;
        }
        throw new common_1.BadRequestException('Email already exists');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(6, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.AppConfig,
        otp_repository_1.OTPRepository,
        email_service_1.EmailService,
        invitation_repository_1.InvitationRepository, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map