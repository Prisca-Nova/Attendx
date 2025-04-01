import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyRepository } from '../repositories/company.repository';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Company } from '../entities/company.entity';
import { EmployeeRepository } from '../repositories/employee.repository';
import { EmployeePojo } from '../pojo/employee.pojo';
import { CompanyPojo } from '../pojo/company.pojo';
import { plainToInstance } from 'class-transformer';
import { UUID } from 'crypto';

@Injectable()
export class CompanyService {
  private readonly log: Logger = new Logger(CompanyService.name);
  constructor(
    @Inject()
    private readonly companyRepository: CompanyRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}
  async create(createCompanyDto: CreateCompanyDto): Promise<CreateCompanyDto> {
    let createdCompany = await this.companyRepository.save(createCompanyDto);
    return plainToInstance(CreateCompanyDto, createdCompany);
  }

  async findAll(): Promise<CompanyPojo[]> {
    const companies = await this.companyRepository.find();
    let items: CompanyPojo[] = [];
    companies.forEach((company) => {
      items.push(plainToInstance(CompanyPojo, company));
    });
    return items;
  }

  async findOne(id: UUID): Promise<Company | undefined> {
    return await this.companyRepository.findOneById(id);
  }

  async update(
    id: UUID,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<UpdateCompanyDto> {
    const company = await this.companyRepository.findOneById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    const updateCompany = await this.companyRepository.update(
      id,
      updateCompanyDto,
    );
    return plainToInstance(UpdateCompanyDto, updateCompany);
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
  async createEmployee(company: Company, createEmployeeDto: CreateEmployeeDto) {
    createEmployeeDto.company = company;
    await this.companyRepository.save(createEmployeeDto);
  }
  async findAllEmployees(company: Company): Promise<EmployeePojo[]> {
    const employees = await this.employeeRepository.findEmployees(company);
    const items: EmployeePojo[] = [];
    return plainToInstance(EmployeePojo, employees);
  }
}
