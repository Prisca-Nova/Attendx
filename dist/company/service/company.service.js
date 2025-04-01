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
var CompanyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const create_company_dto_1 = require("../dto/create-company.dto");
const update_company_dto_1 = require("../dto/update-company.dto");
const company_repository_1 = require("../repositories/company.repository");
const employee_repository_1 = require("../repositories/employee.repository");
const employee_pojo_1 = require("../pojo/employee.pojo");
const company_pojo_1 = require("../pojo/company.pojo");
const class_transformer_1 = require("class-transformer");
let CompanyService = CompanyService_1 = class CompanyService {
    constructor(companyRepository, employeeRepository) {
        this.companyRepository = companyRepository;
        this.employeeRepository = employeeRepository;
        this.log = new common_1.Logger(CompanyService_1.name);
    }
    async create(createCompanyDto) {
        let createdCompany = await this.companyRepository.save(createCompanyDto);
        return (0, class_transformer_1.plainToInstance)(create_company_dto_1.CreateCompanyDto, createdCompany);
    }
    async findAll() {
        const companies = await this.companyRepository.find();
        let items = [];
        companies.forEach((company) => {
            items.push((0, class_transformer_1.plainToInstance)(company_pojo_1.CompanyPojo, company));
        });
        return items;
    }
    async findOne(id) {
        return await this.companyRepository.findOneById(id);
    }
    async update(id, updateCompanyDto) {
        const company = await this.companyRepository.findOneById(id);
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        const updateCompany = await this.companyRepository.update(id, updateCompanyDto);
        return (0, class_transformer_1.plainToInstance)(update_company_dto_1.UpdateCompanyDto, updateCompany);
    }
    remove(id) {
        return `This action removes a #${id} company`;
    }
    async createEmployee(company, createEmployeeDto) {
        createEmployeeDto.company = company;
        await this.companyRepository.save(createEmployeeDto);
    }
    async findAllEmployees(company) {
        const employees = await this.employeeRepository.findEmployees(company);
        const items = [];
        return (0, class_transformer_1.plainToInstance)(employee_pojo_1.EmployeePojo, employees);
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = CompanyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)()),
    __metadata("design:paramtypes", [company_repository_1.CompanyRepository,
        employee_repository_1.EmployeeRepository])
], CompanyService);
//# sourceMappingURL=company.service.js.map