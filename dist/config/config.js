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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfig = exports.AppConfig = void 0;
const configify_1 = require("@itgorillaz/configify");
const class_validator_1 = require("class-validator");
let AppConfig = class AppConfig {
};
exports.AppConfig = AppConfig;
AppConfig.passwordStrictOptions = {
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
};
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsPositive)(),
    (0, configify_1.Value)('OTP_EXPIRY', { parse: (value) => +value }),
    __metadata("design:type", Number)
], AppConfig.prototype, "otpExpiry", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, configify_1.Value)('SECRET_KEY', { default: 'secret' }),
    __metadata("design:type", String)
], AppConfig.prototype, "secretKey", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, configify_1.Value)('MAIL_HOST', { default: 'smtp.example.com' }),
    __metadata("design:type", String)
], AppConfig.prototype, "mailHost", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, configify_1.Value)('MAIL_PORT', { default: 587 }),
    __metadata("design:type", Number)
], AppConfig.prototype, "mailPort", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, configify_1.Value)('MAIL_USER', { default: 'your_email@example.com' }),
    __metadata("design:type", String)
], AppConfig.prototype, "mailUser", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, configify_1.Value)('MAIL_PASSWORD', { default: 'your_password' }),
    __metadata("design:type", String)
], AppConfig.prototype, "mailPassword", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, configify_1.Value)('JWT_AUTH_SECRET'),
    __metadata("design:type", String)
], AppConfig.prototype, "jwtAuthSecret", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, configify_1.Value)('JWT_VERIFICATION_TOKEN_SECRET'),
    __metadata("design:type", String)
], AppConfig.prototype, "jwtVerificationTokenSecret", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, configify_1.Value)('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME', { default: '10m' }),
    __metadata("design:type", String)
], AppConfig.prototype, "jwtVerificationTokenExpirationTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, configify_1.Value)('JWT_REFRESH_TOKEN_EXPIRY_TIME', { default: '7d' }),
    __metadata("design:type", String)
], AppConfig.prototype, "jwtRefreshTokenExpiryTime", void 0);
__decorate([
    (0, configify_1.Value)('ACCESS_TOKEN_LIFE_TIME', { default: '1h' }),
    __metadata("design:type", String)
], AppConfig.prototype, "acessTokenLifeTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, configify_1.Value)('REFRESH_TOKEN_LIFE_TIME', { default: '24h' }),
    __metadata("design:type", String)
], AppConfig.prototype, "refreshTokenLifeTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, configify_1.Value)('USER_UI_URL', { default: 'http://localhost:8080' }),
    __metadata("design:type", String)
], AppConfig.prototype, "userPortalUrl", void 0);
__decorate([
    (0, configify_1.Value)('ADMIN_PORTAL_URL', { default: 'http://localhost:8000' }),
    __metadata("design:type", String)
], AppConfig.prototype, "adminPortalUrl", void 0);
__decorate([
    (0, configify_1.Value)('REDIS_HOST', { default: 'localhost' }),
    __metadata("design:type", String)
], AppConfig.prototype, "redisHost", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, configify_1.Value)('REDIS_PORT', {
        parse: parseInt,
        default: 6379,
    }),
    __metadata("design:type", Number)
], AppConfig.prototype, "redisPort", void 0);
__decorate([
    (0, configify_1.Value)('REDIS_PASSWORD', { default: null }),
    __metadata("design:type", String)
], AppConfig.prototype, "redisPassword", void 0);
exports.AppConfig = AppConfig = __decorate([
    (0, configify_1.Configuration)()
], AppConfig);
let DatabaseConfig = class DatabaseConfig {
};
exports.DatabaseConfig = DatabaseConfig;
__decorate([
    (0, configify_1.Value)('DB_HOST', { default: 'localhost' }),
    __metadata("design:type", String)
], DatabaseConfig.prototype, "host", void 0);
__decorate([
    (0, configify_1.Value)('DB_PORT', {
        parse: parseInt,
        default: 5432,
    }),
    __metadata("design:type", Number)
], DatabaseConfig.prototype, "port", void 0);
__decorate([
    (0, configify_1.Value)('DB_USER', { default: 'postgres' }),
    __metadata("design:type", String)
], DatabaseConfig.prototype, "user", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, configify_1.Value)('DB_PASSWORD'),
    __metadata("design:type", String)
], DatabaseConfig.prototype, "password", void 0);
__decorate([
    (0, configify_1.Value)('DB_NAME', { default: 'attendx' }),
    __metadata("design:type", String)
], DatabaseConfig.prototype, "name", void 0);
__decorate([
    (0, configify_1.Value)('DB_SYNC_ENTITIES', {
        default: true,
        parse: JSON.parse,
    }),
    __metadata("design:type", Boolean)
], DatabaseConfig.prototype, "synchronize", void 0);
__decorate([
    (0, configify_1.Value)('DB_LOGGING', { default: false }),
    __metadata("design:type", Boolean)
], DatabaseConfig.prototype, "logging", void 0);
__decorate([
    (0, configify_1.Value)('DB_MAX_CONNECTIONS', { default: 10 }),
    __metadata("design:type", Number)
], DatabaseConfig.prototype, "maxConnections", void 0);
__decorate([
    (0, configify_1.Value)('DB_MIN_CONNECTIONS', { default: 1 }),
    __metadata("design:type", Number)
], DatabaseConfig.prototype, "minConnections", void 0);
__decorate([
    (0, configify_1.Value)('DB_MIGRATION_TABLE_NAME', { default: 'migrations' }),
    __metadata("design:type", String)
], DatabaseConfig.prototype, "migrationTableName", void 0);
__decorate([
    (0, configify_1.Value)('DB_MIGRATION_RUN_AT_START', { default: true }),
    __metadata("design:type", Boolean)
], DatabaseConfig.prototype, "migrationRunAtStart", void 0);
__decorate([
    (0, configify_1.Value)('DB_AUTO_LOAD_ENTITIES', { default: false }),
    __metadata("design:type", Boolean)
], DatabaseConfig.prototype, "autoLoadEntities", void 0);
__decorate([
    (0, configify_1.Value)('DB_DROP_SCHEMA', { default: false }),
    __metadata("design:type", Boolean)
], DatabaseConfig.prototype, "dropSchema", void 0);
exports.DatabaseConfig = DatabaseConfig = __decorate([
    (0, configify_1.Configuration)()
], DatabaseConfig);
//# sourceMappingURL=config.js.map