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
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const company_service_1 = require("./company.service");
const employee_entity_1 = require("../entities/employee.entity");
const employee_repository_1 = require("../repositories/employee.repository");
let EmployeeService = class EmployeeService {
    constructor(employeeRepository, companyService) {
        this.employeeRepository = employeeRepository;
        this.companyService = companyService;
    }
    async getAllEmployees() {
        return await this.employeeRepository.find({
            relations: ['company'],
        });
    }
    async getEmployeeById(id) {
        const employee = await this.employeeRepository.findOneById(id);
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        return employee;
    }
    async createEmployee(createEmployeeDto) {
        const company = await this.companyService.findOne(createEmployeeDto.company.id);
        const employee = new employee_entity_1.Employee();
        employee.firstName = createEmployeeDto.firstName;
        employee.lastName = createEmployeeDto.lastName;
        employee.email = createEmployeeDto.email;
        employee.contact = createEmployeeDto.contact;
        employee.employeeId = createEmployeeDto.employeeId;
        employee.company = company;
        return await this.employeeRepository.save(employee);
    }
    async updateEmployee(id, updateEmployeeDto) {
        const employee = await this.getEmployeeById(id);
        if (updateEmployeeDto.firstName) {
            employee.firstName = updateEmployeeDto.firstName;
        }
        if (updateEmployeeDto.lastName) {
            employee.lastName = updateEmployeeDto.lastName;
        }
        if (updateEmployeeDto.email) {
            employee.email = updateEmployeeDto.email;
        }
        if (updateEmployeeDto.phoneNumber) {
            employee.contact = updateEmployeeDto.phoneNumber;
        }
        return await this.employeeRepository.save(employee);
    }
    async importEmployeesFromFile(file) {
        const fileExt = path.extname(file.originalname).toLowerCase();
        if (fileExt === '.csv') {
            return this.importFromCsv(file);
        }
        else if (fileExt === '.docx') {
            return this.importFromDocx(file);
        }
        else if (fileExt === '.pdf') {
            throw new common_1.BadRequestException('PDF parsing is not supported yet');
        }
        else {
            throw new common_1.BadRequestException('Unsupported file format');
        }
    }
    async importFromCsv(file) {
        const results = [];
        const tempFilePath = path.join(process.cwd(), 'temp', `${Date.now()}_${file.originalname}`);
        if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
            fs.mkdirSync(path.join(process.cwd(), 'temp'));
        }
        fs.writeFileSync(tempFilePath, file.buffer);
        return new Promise((resolve, reject) => {
            fs.createReadStream(tempFilePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                try {
                    fs.unlinkSync(tempFilePath);
                    let importedCount = 0;
                    for (const row of results) {
                        try {
                            const companyId = row.companyId;
                            const company = await this.companyService.findOne(companyId);
                            const employee = new employee_entity_1.Employee();
                            employee.firstName = row.firstName;
                            employee.lastName = row.lastName;
                            employee.email = row.email;
                            employee.contact = row.contact;
                            employee.employeeId = row.employeeId;
                            employee.company = company;
                            await this.employeeRepository.save(employee);
                            importedCount++;
                        }
                        catch (error) {
                            console.error(`Error importing row: ${JSON.stringify(row)}`, error);
                        }
                    }
                    resolve({ imported: importedCount });
                }
                catch (error) {
                    reject(error);
                }
            })
                .on('error', (error) => {
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
                reject(error);
            });
        });
    }
    async importFromDocx(file) {
        const tempFilePath = path.join(process.cwd(), 'temp', `${Date.now()}_${file.originalname}`);
        if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
            fs.mkdirSync(path.join(process.cwd(), 'temp'));
        }
        fs.writeFileSync(tempFilePath, file.buffer);
        try {
            const result = await mammoth.extractRawText({ path: tempFilePath });
            const text = result.value;
            fs.unlinkSync(tempFilePath);
            const lines = text.split('\n').filter(line => line.trim() !== '');
            let importedCount = 0;
            for (let i = 1; i < lines.length; i++) {
                try {
                    const fields = lines[i].split(',').map(field => field.trim());
                    if (fields.length >= 6) {
                        const companyId = fields[5];
                        const company = await this.companyService.findOne(companyId);
                        const employee = new employee_entity_1.Employee();
                        employee.firstName = fields[0];
                        employee.lastName = fields[1];
                        employee.email = fields[2];
                        employee.contact = fields[3];
                        employee.employeeId = fields[4];
                        employee.company = company;
                        await this.employeeRepository.save(employee);
                        importedCount++;
                    }
                }
                catch (error) {
                    console.error(`Error importing line: ${lines[i]}`, error);
                }
            }
            return { imported: importedCount };
        }
        catch (error) {
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            throw error;
        }
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [employee_repository_1.EmployeeRepository,
        company_service_1.CompanyService])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map