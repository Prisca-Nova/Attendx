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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LunchAttendanceService = void 0;
const common_1 = require("@nestjs/common");
const attendance_repository_1 = require("../repositories/attendance.repository");
const company_repository_1 = require("../repositories/company.repository");
const employee_repository_1 = require("../repositories/employee.repository");
const staff_repository_1 = require("../repositories/staff.repository");
const attendance_dto_1 = require("../dto/attendance.dto");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let LunchAttendanceService = class LunchAttendanceService {
    constructor(lunchAttendanceRepository, companyRepository, employeeRepository, staffRepository, createLunchAttendanceDto) {
        this.lunchAttendanceRepository = lunchAttendanceRepository;
        this.companyRepository = companyRepository;
        this.employeeRepository = employeeRepository;
        this.staffRepository = staffRepository;
        this.createLunchAttendanceDto = createLunchAttendanceDto;
    }
    async createLunchAttendance(createLunchAttendanceDto, currentUser) {
        const company = await this.companyRepository.findOneById(createLunchAttendanceDto.companyId);
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        const employee = await this.employeeRepository.findOneById(createLunchAttendanceDto.employeeId);
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        if (employee.company.id !== company.id) {
            throw new common_1.BadRequestException('Employee does not belong to the company');
        }
        let staff;
        if (currentUser.role === user_entity_1.UserRole.ADMIN) {
            staff = await this.staffRepository.findOne({
                where: { user: { id: currentUser.id }, company: { id: company.id } },
                relations: ['user', 'company'],
            });
            if (!staff) {
                staff = this.staffRepository.create({
                    user: currentUser,
                    company,
                });
                staff = await this.staffRepository.save(staff);
            }
        }
        else {
            staff = await this.staffRepository.findByUserAndCompany(currentUser, company);
            if (!staff || !staff.canRecordAttendance) {
                throw new common_1.BadRequestException('You are not authorized to record lunch attendance');
            }
        }
        const lunchAttendance = this.lunchAttendanceRepository.createAttendance(employee, company, staff, new Date(createLunchAttendanceDto.date), createLunchAttendanceDto.timeIn, createLunchAttendanceDto.timeOut, createLunchAttendanceDto.signature);
        return lunchAttendance;
    }
    async getLunchAttendanceById(id) {
        const lunchAttendance = await this.lunchAttendanceRepository.findOneById(id);
        if (!lunchAttendance) {
            throw new common_1.NotFoundException('Lunch attendance record not found');
        }
        return lunchAttendance;
    }
    async getLunchAttendanceByCompanyAndDateRange(companyId, startDate, endDate, currentUser) {
        const company = await this.companyRepository.findOneById(companyId);
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        if (currentUser.role !== user_entity_1.UserRole.ADMIN) {
            const staff = await this.staffRepository.findByUserAndCompany(currentUser, company);
            if (!staff || (!staff.canRecordAttendance)) {
                throw new common_1.BadRequestException('You are not authorized to view lunch attendance records');
            }
        }
        return await this.lunchAttendanceRepository.findByCompanyAndDateRange(company, new Date(startDate), new Date(endDate));
    }
    async getLunchAttendanceByEmployeeAndDateRange(employeeId, startDate, endDate, currentUser) {
        const employee = await this.employeeRepository.findOneById(employeeId);
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        if (currentUser.role !== user_entity_1.UserRole.ADMIN) {
            const staff = await this.staffRepository.findByUserAndCompany(currentUser, employee.company);
            if (!staff || (!staff.canRecordAttendance)) {
                throw new common_1.BadRequestException('You are not authorized to view lunch attendance records');
            }
        }
        return await this.lunchAttendanceRepository.findByEmployeeAndDateRange(employee, new Date(startDate), new Date(endDate));
    }
    async getAllAttendances(currentUser, startDate, endDate, employeeId) {
        if (currentUser.role === user_entity_1.UserRole.STAFF && employeeId) {
            const employee = await this.employeeRepository.findOneById(employeeId);
            if (!employee) {
                throw new common_1.NotFoundException('Employee not found');
            }
            return await this.lunchAttendanceRepository.findByEmployeeAndDateRange(employee, new Date(startDate), new Date(endDate));
        }
        const staff = await this.staffRepository.findByUser(currentUser);
        if (!staff || staff.length === 0) {
            throw new common_1.BadRequestException('You are not authorized to view lunch attendance records');
        }
        const companyIds = staff.map(s => s.company.id);
        const companies = await this.companyRepository.findBy({
            id: (0, typeorm_1.In)(companyIds),
        });
        return await this.lunchAttendanceRepository.findByCompaniesAndDateRange(companies, new Date(startDate), new Date(endDate));
    }
    async updateAttendance(id, updateData, currentUser) {
        const attendance = await this.lunchAttendanceRepository.findOneById(id);
        if (!attendance) {
            throw new common_1.NotFoundException('Attendance record not found');
        }
        if (currentUser.role !== user_entity_1.UserRole.ADMIN) {
            const staff = await this.staffRepository.findByUserAndCompany(currentUser, attendance.company);
            if (!staff || !staff.canRecordAttendance) {
                throw new common_1.BadRequestException('You are not authorized to update this attendance record');
            }
        }
        Object.assign(attendance, updateData);
        return await this.lunchAttendanceRepository.save(attendance);
    }
};
exports.LunchAttendanceService = LunchAttendanceService;
exports.LunchAttendanceService = LunchAttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attendance_repository_1.LunchAttendanceRepository,
        company_repository_1.CompanyRepository,
        employee_repository_1.EmployeeRepository,
        staff_repository_1.StaffRepository,
        attendance_dto_1.CreateAttendanceDto])
], LunchAttendanceService);
//# sourceMappingURL=attendance.service.js.map