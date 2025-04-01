import { UUID } from 'crypto';
import { CompanyService } from './company.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { Employee } from '../entities/employee.entity';
import { EmployeeRepository } from '../repositories/employee.repository';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
export declare class EmployeeService {
    private readonly employeeRepository;
    private readonly companyService;
    constructor(employeeRepository: EmployeeRepository, companyService: CompanyService);
    getAllEmployees(): Promise<Employee[]>;
    getEmployeeById(id: UUID): Promise<Employee>;
    createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<Employee>;
    updateEmployee(id: UUID, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee>;
    importEmployeesFromFile(file: Express.Multer.File): Promise<{
        imported: number;
    }>;
    private importFromCsv;
    private importFromDocx;
}
