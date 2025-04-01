import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { UUID } from 'crypto';
import { Company } from '../entities/company.entity';

@Injectable()
export class EmployeeRepository extends Repository<Employee> {
  constructor(private readonly dataSource: DataSource) {
    super(Employee, dataSource.createEntityManager());
  }
  async findOneById(id: UUID): Promise<Employee | undefined> {
    return await this.findOne({ where: { id: id } });
  }
  async findEmployees(company: Company) {
    return await this.findBy({ company: { id: company.id } });
  }
}
