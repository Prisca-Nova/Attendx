"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const http_response_1 = require("../dto/http-response");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        this.logger.error(exception);
        if (exception instanceof common_1.HttpException) {
            const statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (statusCode === common_1.HttpStatus.BAD_REQUEST &&
                Array.isArray(exceptionResponse?.message)) {
                const validationErrors = {};
                const processValidationErrors = (errors, prefix = '') => {
                    errors.forEach((error) => {
                        const property = prefix
                            ? `${prefix}.${error.property}`
                            : error.property;
                        if (error.constraints) {
                            validationErrors[property] = Object.values(error.constraints);
                        }
                        if (error.children && error.children.length > 0) {
                            processValidationErrors(error.children, property);
                        }
                    });
                };
                processValidationErrors(exceptionResponse.message);
                return response
                    .status(common_1.HttpStatus.BAD_REQUEST)
                    .json(http_response_1.HttpResponse.error('Validation failed', validationErrors));
            }
            return response
                .status(statusCode)
                .json(http_response_1.HttpResponse.error(typeof exceptionResponse === 'string'
                ? exceptionResponse
                : exceptionResponse.message));
        }
        if (exception instanceof typeorm_1.EntityNotFoundError) {
            return response
                .status(common_1.HttpStatus.NOT_FOUND)
                .json(http_response_1.HttpResponse.error('Entity not found'));
        }
        return response
            .status(common_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json(http_response_1.HttpResponse.error('Internal server error'));
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map