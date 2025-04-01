import { DataSource, Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { UUID } from 'crypto';
import { Company } from '../entities/company.entity';
export declare class EmployeeRepository extends Repository<Employee> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    findOneById(id: UUID): Promise<Employee | undefined>;
    findEmployees(company: Company): Promise<Employee[]>;
}
