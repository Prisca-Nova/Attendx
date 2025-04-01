import { Company } from '../entities/company.entity';
export declare class CreateEmployeeDto {
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
    contact: string;
    company: Company;
}
