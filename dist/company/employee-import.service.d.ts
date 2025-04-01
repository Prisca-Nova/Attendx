import { EmployeeRepository } from './repositories/employee.repository';
import { CompanyRepository } from './repositories/company.repository';
import { UUID } from 'crypto';
export declare class EmployeeImportService {
    private readonly employeeRepository;
    private readonly companyRepository;
    private readonly logger;
    constructor(employeeRepository: EmployeeRepository, companyRepository: CompanyRepository);
    importEmployeesFromCsv(file: Buffer, companyId: UUID): Promise<number>;
    private createEmployeeFromCsvRow;
}
