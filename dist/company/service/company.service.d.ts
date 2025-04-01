import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyRepository } from '../repositories/company.repository';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Company } from '../entities/company.entity';
import { EmployeeRepository } from '../repositories/employee.repository';
import { EmployeePojo } from '../pojo/employee.pojo';
import { CompanyPojo } from '../pojo/company.pojo';
import { UUID } from 'crypto';
export declare class CompanyService {
    private readonly companyRepository;
    private readonly employeeRepository;
    private readonly log;
    constructor(companyRepository: CompanyRepository, employeeRepository: EmployeeRepository);
    create(createCompanyDto: CreateCompanyDto): Promise<CreateCompanyDto>;
    findAll(): Promise<CompanyPojo[]>;
    findOne(id: UUID): Promise<Company | undefined>;
    update(id: UUID, updateCompanyDto: UpdateCompanyDto): Promise<UpdateCompanyDto>;
    remove(id: number): string;
    createEmployee(company: Company, createEmployeeDto: CreateEmployeeDto): Promise<void>;
    findAllEmployees(company: Company): Promise<EmployeePojo[]>;
}
