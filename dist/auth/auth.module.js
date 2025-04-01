"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const user_module_1 = require("../user/user.module");
const jwt_1 = require("@nestjs/jwt");
const configify_1 = require("@itgorillaz/configify");
const config_1 = require("../config/config");
const common_module_1 = require("../common/common.module");
const otp_repository_1 = require("./repositories/otp.repository");
const email_module_1 = require("../email/email.module");
const invitation_repository_1 = require("./repositories/invitation.repository");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.AppConfig],
                inject: [config_1.AppConfig],
                useFactory: async (configService) => ({
                    secret: configService.jwtAuthSecret,
                    signOptions: { expiresIn: configService.acessTokenLifeTime },
                }),
                global: true,
            }),
            common_module_1.CommonModule,
            configify_1.ConfigifyModule,
            email_module_1.EmailModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, otp_repository_1.OTPRepository, invitation_repository_1.InvitationRepository],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map