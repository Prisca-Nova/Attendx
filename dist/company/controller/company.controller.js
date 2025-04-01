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
exports.EmployeeController = exports.CompanyController = void 0;
const common_1 = require("@nestjs/common");
const company_service_1 = require("../service/company.service");
const create_company_dto_1 = require("../dto/create-company.dto");
const update_company_dto_1 = require("../dto/update-company.dto");
const http_response_1 = require("../../common/dto/http-response");
const swagger_1 = require("@nestjs/swagger");
const company_pojo_1 = require("../pojo/company.pojo");
const create_employee_dto_1 = require("../dto/create-employee.dto");
const auth_guard_1 = require("../../auth/auth.guard");
const role_guard_1 = require("../../auth/role/role.guard");
const role_decorator_1 = require("../../common/decorator/role.decorator");
const user_entity_1 = require("../../user/entities/user.entity");
let CompanyController = class CompanyController {
    constructor(companyService) {
        this.companyService = companyService;
    }
    async create(createCompanyDto) {
        return http_response_1.HttpResponse.success(await this.companyService.create(createCompanyDto), 'Company created successfully');
    }
    findAll() {
        return this.companyService.findAll();
    }
    findOne(id) {
        return this.companyService.findOne(id);
    }
    async update(id, updateCompanyDto) {
        return http_response_1.HttpResponse.success(await this.companyService.update(id, updateCompanyDto), 'Company updated successfully');
    }
};
exports.CompanyController = CompanyController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RoleGuard),
    (0, role_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new company' }),
    (0, swagger_1.ApiResponse)({ type: create_company_dto_1.CreateCompanyDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all companies' }),
    (0, swagger_1.ApiResponse)({ type: [company_pojo_1.CompanyPojo] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a company by id' }),
    (0, swagger_1.ApiResponse)({ type: company_pojo_1.CompanyPojo }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_company_dto_1.UpdateCompanyDto]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "update", null);
exports.CompanyController = CompanyController = __decorate([
    (0, common_1.Controller)('company'),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], CompanyController);
let EmployeeController = class EmployeeController {
    constructor(companyService) {
        this.companyService = companyService;
    }
    async createEmployee(companyId, createEmployeeDto) {
        const company = await this.companyService.findOne(companyId);
        await this.companyService.createEmployee(company, createEmployeeDto);
        return http_response_1.HttpResponse.success();
    }
    async findAll(companyId) {
        const company = await this.companyService.findOne(companyId);
        return http_response_1.HttpResponse.success(await this.companyService.findAllEmployees(company), 'Employees retrieved successfully');
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new employee' }),
    (0, swagger_1.ApiResponse)({ type: create_employee_dto_1.CreateEmployeeDto }),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all employees' }),
    (0, swagger_1.ApiResponse)({ type: [company_pojo_1.CompanyPojo] }),
    __param(0, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findAll", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, common_1.Controller)('company/:companyId/employee'),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], EmployeeController);
//# sourceMappingURL=company.controller.js.map