import { CompanyService } from '../service/company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { HttpResponse } from '../../common/dto/http-response';
import { CompanyPojo } from '../pojo/company.pojo';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UUID } from 'crypto';
import { EmployeePojo } from '../pojo/employee.pojo';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    create(createCompanyDto: CreateCompanyDto): Promise<HttpResponse<CreateCompanyDto>>;
    findAll(): Promise<CompanyPojo[]>;
    findOne(id: UUID): Promise<import("../entities/company.entity").Company>;
    update(id: UUID, updateCompanyDto: UpdateCompanyDto): Promise<HttpResponse<UpdateCompanyDto>>;
}
export declare class EmployeeController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    createEmployee(companyId: UUID, createEmployeeDto: CreateEmployeeDto): Promise<HttpResponse<any>>;
    findAll(companyId: UUID): Promise<HttpResponse<EmployeePojo[]>>;
}
