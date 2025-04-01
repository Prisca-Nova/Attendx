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
var AttendanceCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const attendance_repository_1 = require("../repositories/attendance.repository");
const company_repository_1 = require("../repositories/company.repository");
const employee_repository_1 = require("../repositories/employee.repository");
const attendance_entity_1 = require("../entities/attendance.entity");
let AttendanceCronService = AttendanceCronService_1 = class AttendanceCronService {
    constructor(attendanceRepository, companyRepository, employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.companyRepository = companyRepository;
        this.employeeRepository = employeeRepository;
        this.logger = new common_1.Logger(AttendanceCronService_1.name);
    }
    async createLunchAttendanceRecords() {
        this.logger.log('Creating lunch attendance records for today');
        const today = new Date();
        try {
            const companies = await this.companyRepository.find();
            for (const company of companies) {
                const employees = await this.employeeRepository.findEmployees(company);
                const existingRecords = await this.attendanceRepository.find({
                    where: {
                        company: { id: company.id },
                        date: today,
                    }
                });
                const employeesWithRecords = new Set(existingRecords.map(record => record.employee?.id?.toString()));
                const newRecords = [];
                for (const employee of employees) {
                    if (!employeesWithRecords.has(employee.id.toString())) {
                        const attendance = new attendance_entity_1.Attendance();
                        attendance.employee = employee;
                        attendance.company = company;
                        attendance.date = today;
                        attendance.timeIn = '00:00';
                        attendance.timeOut = '00:00';
                        attendance.signature = '';
                        newRecords.push(attendance);
                    }
                }
                if (newRecords.length > 0) {
                    await this.attendanceRepository.save(newRecords);
                    this.logger.log(`Created ${newRecords.length} lunch attendance records for company ${company.name}`);
                }
            }
            this.logger.log('Lunch attendance record creation completed');
        }
        catch (error) {
            this.logger.error('Error creating lunch attendance records:', error.stack);
        }
    }
    async checkMissingAttendanceRecords() {
        this.logger.log('Checking for missing attendance entries');
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        try {
            const incompleteAttendances = await this.attendanceRepository.find({
                where: [
                    { date: today, timeIn: '00:00' },
                    { date: today, timeOut: '00:00' }
                ],
                relations: ['employee', 'company']
            });
            if (incompleteAttendances.length > 0) {
                this.logger.warn(`Found ${incompleteAttendances.length} incomplete attendance records for today`);
            }
        }
        catch (error) {
            this.logger.error('Error checking missing attendance records:', error.stack);
        }
    }
};
exports.AttendanceCronService = AttendanceCronService;
__decorate([
    (0, schedule_1.Cron)('0 30 11 * * 1-5'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendanceCronService.prototype, "createLunchAttendanceRecords", null);
__decorate([
    (0, schedule_1.Cron)('0 30 23 * * 1-5'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendanceCronService.prototype, "checkMissingAttendanceRecords", null);
exports.AttendanceCronService = AttendanceCronService = AttendanceCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attendance_repository_1.LunchAttendanceRepository,
        company_repository_1.CompanyRepository,
        employee_repository_1.EmployeeRepository])
], AttendanceCronService);
//# sourceMappingURL=attendance.cron.service.js.map