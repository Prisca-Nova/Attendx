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
exports.StaffController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const staff_service_1 = require("../service/staff.service");
const create_staff_dto_1 = require("../dto/create-staff.dto");
const update_staff_dto_1 = require("../dto/update-staff.dto");
const http_response_1 = require("../../common/dto/http-response");
const auth_guard_1 = require("../../auth/auth.guard");
let StaffController = class StaffController {
    constructor(staffService) {
        this.staffService = staffService;
    }
    async createStaff(createStaffDto, req) {
        const staff = await this.staffService.createStaff(createStaffDto, req.user);
        return http_response_1.HttpResponse.success(staff, 'Staff created successfully');
    }
    async getStaffById(id) {
        const staff = await this.staffService.getStaffById(id);
        return http_response_1.HttpResponse.success(staff, 'Staff retrieved successfully');
    }
    async getStaffByCompany(companyId) {
        const staff = await this.staffService.getStaffByCompany(companyId);
        return http_response_1.HttpResponse.success(staff, 'Staff retrieved successfully');
    }
    async getStaffByUser(userId) {
        const staff = await this.staffService.getStaffByUser(userId);
        return http_response_1.HttpResponse.success(staff, 'Staff retrieved successfully');
    }
    async updateStaff(id, updateStaffDto, req) {
        const staff = await this.staffService.updateStaff(id, updateStaffDto, req.user);
        return http_response_1.HttpResponse.success(staff, 'Staff updated successfully');
    }
    async deleteStaff(id, req) {
        await this.staffService.deleteStaff(id, req.user);
        return http_response_1.HttpResponse.success(null, 'Staff deleted successfully');
    }
};
exports.StaffController = StaffController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new staff member' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Staff created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_staff_dto_1.CreateStaffDto, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "createStaff", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffById", null);
__decorate([
    (0, common_1.Get)('company/:companyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all staff by company ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff retrieved successfully' }),
    __param(0, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffByCompany", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all staff roles for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff retrieved successfully' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "getStaffByUser", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update staff' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_staff_dto_1.UpdateStaffDto, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "updateStaff", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete staff' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StaffController.prototype, "deleteStaff", null);
exports.StaffController = StaffController = __decorate([
    (0, swagger_1.ApiTags)('Staff'),
    (0, common_1.Controller)('staff'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [staff_service_1.StaffService])
], StaffController);
//# sourceMappingURL=staff.controller.js.map