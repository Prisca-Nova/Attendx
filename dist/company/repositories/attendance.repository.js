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
exports.LunchAttendanceRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const attendance_entity_1 = require("../entities/attendance.entity");
let LunchAttendanceRepository = class LunchAttendanceRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(attendance_entity_1.Attendance, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findOneById(id) {
        return await this.findOne({
            where: { id: id },
            relations: ['employee', 'company', 'recordedBy', 'recordedBy.user']
        });
    }
    async createAttendance(employee, company, recordedBy, date, timeIn, timeOut, signature) {
        const attendance = this.create({
            employee,
            company,
            recordedBy,
            date,
            timeIn,
            timeOut,
            signature,
        });
        return await this.save(attendance);
    }
    async findByCompanyAndDateRange(company, startDate, endDate) {
        return await this.find({
            where: {
                company: { id: company.id },
                date: (0, typeorm_1.Between)(startDate, endDate)
            },
            relations: ['employee', 'recordedBy', 'recordedBy.user'],
            order: { date: 'DESC', timeIn: 'ASC' }
        });
    }
    async findByCompaniesAndDateRange(companies, startDate, endDate) {
        return await this.find({
            where: {
                company: (0, typeorm_1.In)(companies.map(company => company.id)),
                date: (0, typeorm_1.Between)(startDate, endDate),
            },
            relations: ['employee', 'recordedBy', 'recordedBy.user'],
            order: { date: 'DESC', timeIn: 'ASC' },
        });
    }
    async findByEmployeeAndDateRange(employee, startDate, endDate) {
        return await this.find({
            where: {
                employee: { id: employee.id },
                date: (0, typeorm_1.Between)(startDate, endDate)
            },
            relations: ['recordedBy', 'recordedBy.user'],
            order: { date: 'DESC', timeIn: 'ASC' }
        });
    }
};
exports.LunchAttendanceRepository = LunchAttendanceRepository;
exports.LunchAttendanceRepository = LunchAttendanceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], LunchAttendanceRepository);
//# sourceMappingURL=attendance.repository.js.map