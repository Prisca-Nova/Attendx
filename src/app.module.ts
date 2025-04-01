import { Module } from '@nestjs/common';
import { ConfigifyModule } from '@itgorillaz/configify';
import { AppConfig, DatabaseConfig } from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { redisStore } from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { EmailModule } from './email/email.module';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    CacheModule.registerAsync({
      inject: [AppConfig],
      isGlobal: true,
      useFactory: async (appConfig: AppConfig) => {
        const store = await redisStore({
          password: appConfig.redisPassword,
          socket: {
            host: appConfig.redisHost,
            port: appConfig.redisPort,
            passphrase: appConfig.redisPassword,
          },
        });

        return {
          store: store,
          ttl: 3 * 60000, // 3 minutes (milliseconds)
        };
      },
    }),
    BullModule.forRootAsync({
      inject: [AppConfig],
      useFactory: (appConfig: AppConfig) => ({
        connection: {
          host: appConfig.redisHost,
          port: appConfig.redisPort,
          password: appConfig.redisPassword,
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfig, AppConfig],
      useFactory: (dbConfig: DatabaseConfig) => ({
        type: 'postgres',
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.name,
        entities: ['./dist/**/*.entity.js'],
        synchronize: dbConfig.synchronize,
        logging: dbConfig.logging,
        autoLoadEntities: dbConfig.autoLoadEntities,
        dropSchema: false,
        migrationsRun: dbConfig.migrationRunAtStart,
        migrationsTableName: dbConfig.migrationTableName,
        extra: {
          max: dbConfig.maxConnections,
          min: dbConfig.minConnections,
        },
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
        skipIf: () => process.env.NODE_ENV === 'dev',
      },
      {
        ttl: 3600,
        limit: 100,
      },
    ]),
    AuthModule,
    CommonModule,
    CoreModule,
    UserModule,
    CompanyModule,
    EmailModule,
  ],
  providers: [AuthGuard],
  exports: [EmailModule, UserModule, AuthModule, AuthGuard],
})
export class AppModule {}
