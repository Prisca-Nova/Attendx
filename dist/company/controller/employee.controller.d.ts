import { UUID } from 'crypto';
import { HttpResponse } from 'src/common/dto/http-response';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Employee } from '../entities/employee.entity';
import { EmployeeService } from '../service/employee.service';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    getAllEmployees(): Promise<HttpResponse<Employee[]>>;
    getEmployeeById(id: UUID): Promise<HttpResponse<Employee>>;
    createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<HttpResponse<Employee>>;
    updateEmployee(id: UUID, updateEmployeeDto: UpdateEmployeeDto): Promise<HttpResponse<Employee>>;
    importEmployees(file: Express.Multer.File): Promise<HttpResponse<{
        imported: number;
    }>>;
}
