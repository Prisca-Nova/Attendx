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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
const auth_guard_1 = require("../../auth/auth.guard");
const http_response_1 = require("../../common/dto/http-response");
const attendance_service_1 = require("../service/attendance.service");
const attendance_dto_1 = require("../dto/attendance.dto");
const employee_service_1 = require("../service/employee.service");
let AttendanceController = class AttendanceController {
    constructor(attendanceService, employeeService) {
        this.attendanceService = attendanceService;
        this.employeeService = employeeService;
    }
    async getAllAttendances(req, startDate, endDate, employeeId) {
        const currentUser = req.user;
        const attendances = await this.attendanceService.getAllAttendances(currentUser, startDate, endDate, employeeId);
        return http_response_1.HttpResponse.success(attendances, 'Attendances retrieved successfully');
    }
    async getAttendanceById(id) {
        const attendance = await this.attendanceService.getLunchAttendanceById(id);
        return http_response_1.HttpResponse.success(attendance, 'Attendance retrieved successfully');
    }
    async createAttendance(req, createAttendanceDto) {
        const currentUser = req.user;
        const attendance = await this.attendanceService.createLunchAttendance(createAttendanceDto, currentUser);
        return http_response_1.HttpResponse.success(attendance, 'Attendance created successfully');
    }
    async updateAttendance(id, updateAttendanceDto, req) {
        const currentUser = req.user;
        const attendance = await this.attendanceService.updateAttendance(id, updateAttendanceDto, currentUser);
        return http_response_1.HttpResponse.success(attendance, 'Attendance updated successfully');
    }
    async recordLunchAttendance(recordLunchAttendanceDto, req) {
        const currentUser = req.user;
        if (!recordLunchAttendanceDto.employeeId) {
            throw new common_1.BadRequestException('Employee ID is required');
        }
        const employee = await this.employeeService.getEmployeeById(recordLunchAttendanceDto.employeeId);
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const createAttendanceDto = {
            ...recordLunchAttendanceDto,
            companyId: employee.company.id,
            timeOut: recordLunchAttendanceDto.timeOut || new Date().toISOString(),
        };
        const attendance = await this.attendanceService.createLunchAttendance(createAttendanceDto, currentUser);
        return http_response_1.HttpResponse.success(attendance, 'Lunch attendance recorded successfully');
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all attendances' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of attendances' }),
    __param(0, (0, common_2.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Date,
        Date, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAllAttendances", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance retrieved' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create attendance' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attendance created' }),
    __param(0, (0, common_2.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, attendance_dto_1.CreateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "createAttendance", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update attendance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attendance_dto_1.UpdateAttendanceDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "updateAttendance", null);
__decorate([
    (0, common_1.Post)('lunch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Record lunch attendance' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Lunch attendance recorded' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.RecordLunchAttendanceDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "recordLunchAttendance", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, swagger_1.ApiTags)('Attendance'),
    (0, common_1.Controller)('attendance'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [attendance_service_1.LunchAttendanceService,
        employee_service_1.EmployeeService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map