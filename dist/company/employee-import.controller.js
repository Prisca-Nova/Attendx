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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeImportController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const auth_guard_1 = require("../auth/auth.guard");
const employee_import_service_1 = require("./employee-import.service");
const swagger_1 = require("@nestjs/swagger");
const http_response_1 = require("../common/dto/http-response");
let EmployeeImportController = class EmployeeImportController {
    constructor(employeeImportService) {
        this.employeeImportService = employeeImportService;
    }
    async importEmployeesFromCsv(file, companyId) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const importedCount = await this.employeeImportService.importEmployeesFromCsv(file.buffer, companyId);
        return http_response_1.HttpResponse.success({ importedCount }, `Successfully imported ${importedCount} employees`);
    }
};
exports.EmployeeImportController = EmployeeImportController;
__decorate([
    (0, common_1.Post)('csv/:companyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Import employees from CSV file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({ name: 'companyId', required: true, type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Employees imported successfully',
        type: http_response_1.HttpResponse,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(csv)$/)) {
                return callback(new common_1.BadRequestException('Only CSV files are allowed'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('companyId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmployeeImportController.prototype, "importEmployeesFromCsv", null);
exports.EmployeeImportController = EmployeeImportController = __decorate([
    (0, swagger_1.ApiTags)('Employee Import'),
    (0, common_1.Controller)('employees/import'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [employee_import_service_1.EmployeeImportService])
], EmployeeImportController);
//# sourceMappingURL=employee-import.controller.js.map