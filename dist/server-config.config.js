"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureCors = configureCors;
exports.configureSwagger = configureSwagger;
exports.configureGlobalPipes = configureGlobalPipes;
exports.configureGlobalFilters = configureGlobalFilters;
exports.configureGlobalInterceptors = configureGlobalInterceptors;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./common/http-exception/http-exception.filter");
const core_1 = require("@nestjs/core");
function configureCors(app) {
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(','),
        methods: process.env.ALLOWED_METHODS?.split(',') || [
            'GET',
            'POST',
            'PUT',
            'DELETE',
            'PATCH',
            'OPTIONS',
        ],
        allowedHeaders: process.env.ALLOWED_HEADERS?.split(',') || [
            'Content-Type',
            'Authorization',
        ],
        credentials: process.env.ALLOW_CREDENTIALS === 'true',
        maxAge: parseInt(process.env.CORS_MAX_AGE || '3600'),
    });
}
function configureSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Attent X')
        .setDescription('Attent X')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addServer('/api')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/doc', app, document);
}
function configureGlobalPipes(app) {
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors) => {
            const formattedErrors = {};
            errors.forEach((error) => {
                formattedErrors[error.property] = Object.values(error.constraints || {});
            });
            return new common_1.BadRequestException(errors);
        },
    }));
}
function configureGlobalFilters(app) {
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
}
function configureGlobalInterceptors(app) {
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
}
//# sourceMappingURL=server-config.config.js.map