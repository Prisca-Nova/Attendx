import { Configuration, Value } from '@itgorillaz/configify';
import {
  IsNotEmpty,
  IsNumber,
  IsStrongPasswordOptions,
  IsPositive,
} from 'class-validator';

@Configuration()
export class AppConfig {
  @IsNotEmpty()
  @IsPositive()
  @Value('OTP_EXPIRY', { parse: (value) => +value })
  otpExpiry: number;

  @IsNotEmpty()
  @Value('SECRET_KEY', { default: 'secret' })
  secretKey: string;

  @IsNotEmpty()
  @Value('MAIL_HOST', { default: 'smtp.example.com' })
  mailHost: string;

  @IsNotEmpty()
  @Value('MAIL_PORT', { default: 587 })
  mailPort: number;

  @IsNotEmpty()
  @Value('MAIL_USER', { default: 'your_email@example.com' })
  mailUser: string;

  @IsNotEmpty()
  @Value('MAIL_PASSWORD', { default: 'your_password' })
  mailPassword: string;

  @IsNotEmpty()
  @Value('JWT_AUTH_SECRET')
  jwtAuthSecret: string;

  @IsNotEmpty()
  @Value('JWT_VERIFICATION_TOKEN_SECRET')
  jwtVerificationTokenSecret: string;

  @IsNotEmpty()
  @Value('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME', { default: '10m' })
  jwtVerificationTokenExpirationTime: string;

  @IsNotEmpty()
  @Value('JWT_REFRESH_TOKEN_EXPIRY_TIME', { default: '7d' })
  jwtRefreshTokenExpiryTime: string;

  @Value('ACCESS_TOKEN_LIFE_TIME', { default: '1h' })
  acessTokenLifeTime: string;

  @IsNotEmpty()
  @Value('REFRESH_TOKEN_LIFE_TIME', { default: '24h' })
  refreshTokenLifeTime: string;

  @IsNotEmpty()
  @Value('USER_UI_URL', { default: 'http://localhost:8080' })
  userPortalUrl: string;
  @Value('ADMIN_PORTAL_URL', { default: 'http://localhost:8000' })
  adminPortalUrl: string;

  static readonly passwordStrictOptions: IsStrongPasswordOptions = {
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  };

  @Value('REDIS_HOST', { default: 'localhost' })
  redisHost: string;

  @IsNumber()
  @Value('REDIS_PORT', {
    parse: parseInt,
    default: 6379,
  })
  redisPort: number;

  @Value('REDIS_PASSWORD', { default: null })
  redisPassword: string;
}
@Configuration()
export class DatabaseConfig {
  @Value('DB_HOST', { default: 'localhost' })
  host: string;

  @Value('DB_PORT', {
    parse: parseInt,
    default: 5432,
  })
  port: number;
  @Value('DB_USER', { default: 'postgres' })
  user: string;

  @IsNotEmpty()
  @Value('DB_PASSWORD')
  password: string;

  @Value('DB_NAME', { default: 'attendx' })
  name: string;

  @Value('DB_SYNC_ENTITIES', {
    default: true,
    parse: JSON.parse,
  })
  synchronize: boolean;

  @Value('DB_LOGGING', { default: false })
  logging: boolean;

  @Value('DB_MAX_CONNECTIONS', { default: 10 })
  maxConnections: number;

  @Value('DB_MIN_CONNECTIONS', { default: 1 })
  minConnections: number;

  @Value('DB_MIGRATION_TABLE_NAME', { default: 'migrations' })
  migrationTableName: string;

  @Value('DB_MIGRATION_RUN_AT_START', { default: true })
  migrationRunAtStart: boolean;

  @Value('DB_AUTO_LOAD_ENTITIES', { default: false })
  autoLoadEntities: boolean;

  @Value('DB_DROP_SCHEMA', { default: false })
  dropSchema: boolean;
}
