import { IsStrongPasswordOptions } from 'class-validator';
export declare class AppConfig {
    otpExpiry: number;
    secretKey: string;
    mailHost: string;
    mailPort: number;
    mailUser: string;
    mailPassword: string;
    jwtAuthSecret: string;
    jwtVerificationTokenSecret: string;
    jwtVerificationTokenExpirationTime: string;
    jwtRefreshTokenExpiryTime: string;
    acessTokenLifeTime: string;
    refreshTokenLifeTime: string;
    userPortalUrl: string;
    adminPortalUrl: string;
    static readonly passwordStrictOptions: IsStrongPasswordOptions;
    redisHost: string;
    redisPort: number;
    redisPassword: string;
}
export declare class DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    synchronize: boolean;
    logging: boolean;
    maxConnections: number;
    minConnections: number;
    migrationTableName: string;
    migrationRunAtStart: boolean;
    autoLoadEntities: boolean;
    dropSchema: boolean;
}
