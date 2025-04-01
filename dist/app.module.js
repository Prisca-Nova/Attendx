"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const configify_1 = require("@itgorillaz/configify");
const config_1 = require("./config/config");
const typeorm_1 = require("@nestjs/typeorm");
const bullmq_1 = require("@nestjs/bullmq");
const cache_manager_1 = require("@nestjs/cache-manager");
const throttler_1 = require("@nestjs/throttler");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
const auth_module_1 = require("./auth/auth.module");
const common_module_1 = require("./common/common.module");
const core_module_1 = require("./core/core.module");
const user_module_1 = require("./user/user.module");
const company_module_1 = require("./company/company.module");
const email_module_1 = require("./email/email.module");
const auth_guard_1 = require("./auth/auth.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            configify_1.ConfigifyModule.forRootAsync(),
            cache_manager_1.CacheModule.registerAsync({
                inject: [config_1.AppConfig],
                isGlobal: true,
                useFactory: async (appConfig) => {
                    const store = await (0, cache_manager_redis_store_1.redisStore)({
                        password: appConfig.redisPassword,
                        socket: {
                            host: appConfig.redisHost,
                            port: appConfig.redisPort,
                            passphrase: appConfig.redisPassword,
                        },
                    });
                    return {
                        store: store,
                        ttl: 3 * 60000,
                    };
                },
            }),
            bullmq_1.BullModule.forRootAsync({
                inject: [config_1.AppConfig],
                useFactory: (appConfig) => ({
                    connection: {
                        host: appConfig.redisHost,
                        port: appConfig.redisPort,
                        password: appConfig.redisPassword,
                    },
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.DatabaseConfig, config_1.AppConfig],
                useFactory: (dbConfig) => ({
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
                    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([
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
            auth_module_1.AuthModule,
            common_module_1.CommonModule,
            core_module_1.CoreModule,
            user_module_1.UserModule,
            company_module_1.CompanyModule,
            email_module_1.EmailModule,
        ],
        providers: [auth_guard_1.AuthGuard],
        exports: [email_module_1.EmailModule, user_module_1.UserModule, auth_module_1.AuthModule, auth_guard_1.AuthGuard],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map