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
var EmployeeImportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeImportService = void 0;
const common_1 = require("@nestjs/common");
const employee_repository_1 = require("./repositories/employee.repository");
const company_repository_1 = require("./repositories/company.repository");
const employee_entity_1 = require("./entities/employee.entity");
const csv = require("csv-parser");
const stream_1 = require("stream");
const uuid_1 = require("uuid");
let EmployeeImportService = EmployeeImportService_1 = class EmployeeImportService {
    constructor(employeeRepository, companyRepository) {
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.logger = new common_1.Logger(EmployeeImportService_1.name);
    }
    async importEmployeesFromCsv(file, companyId) {
        const company = await this.companyRepository.findOneById(companyId);
        if (!company) {
            throw new common_1.BadRequestException('Company not found');
        }
        const results = [];
        let errorCount = 0;
        await new Promise((resolve, reject) => {
            const readableStream = new stream_1.Readable();
            readableStream.push(file);
            readableStream.push(null);
            readableStream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('error', (err) => {
                this.logger.error(`Error parsing CSV: ${err.message}`);
                reject(new common_1.BadRequestException('Invalid CSV format'));
            })
                .on('end', () => {
                resolve();
            });
        });
        for (const row of results) {
            try {
                await this.createEmployeeFromCsvRow(row, company);
            }
            catch (error) {
                this.logger.error(`Error importing employee: ${error.message}`);
                errorCount++;
            }
        }
        const importedCount = results.length - errorCount;
        this.logger.log(`Imported ${importedCount} employees (${errorCount} errors)`);
        return importedCount;
    }
    async createEmployeeFromCsvRow(row, company) {
        if (!row.firstName || !row.lastName || !row.email) {
            throw new common_1.BadRequestException('Missing required fields in CSV row');
        }
        const existingEmployee = await this.employeeRepository.findOne({
            where: { email: row.email, company: { id: company.id } },
        });
        if (existingEmployee) {
            throw new common_1.BadRequestException(`Employee with email ${row.email} already exists`);
        }
        const employee = new employee_entity_1.Employee();
        employee.firstName = row.firstName;
        employee.lastName = row.lastName;
        employee.email = row.email;
        employee.contact = row.contact || '';
        employee.employeeId = row.employeeId || (0, uuid_1.v4)().slice(0, 8).toUpperCase();
        employee.company = company;
        return await this.employeeRepository.save(employee);
    }
};
exports.EmployeeImportService = EmployeeImportService;
exports.EmployeeImportService = EmployeeImportService = EmployeeImportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [employee_repository_1.EmployeeRepository,
        company_repository_1.CompanyRepository])
], EmployeeImportService);
//# sourceMappingURL=employee-import.service.js.map