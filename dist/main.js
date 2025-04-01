"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const compression = require("compression");
const server_config_config_1 = require("./server-config.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    configureApp(app);
    await app.listen(process.env.PORT ?? 3000);
}
function configureApp(app) {
    (0, server_config_config_1.configureCors)(app);
    (0, server_config_config_1.configureSwagger)(app);
    (0, server_config_config_1.configureGlobalPipes)(app);
    (0, server_config_config_1.configureGlobalFilters)(app);
    (0, server_config_config_1.configureGlobalInterceptors)(app);
    app.setGlobalPrefix('api');
    app.use(compression());
}
bootstrap().catch((error) => {
    const logger = new common_1.Logger('Bootstrap');
    logger.error('Error during application bootstrap:', error.stack);
});
//# sourceMappingURL=main.js.map