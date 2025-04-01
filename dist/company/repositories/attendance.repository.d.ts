import { DataSource, Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { UUID } from 'crypto';
import { Company } from '../entities/company.entity';
import { Staff } from '../entities/staff.entity';
import { Employee } from '../entities/employee.entity';
export declare class LunchAttendanceRepository extends Repository<Attendance> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    findOneById(id: UUID): Promise<Attendance | undefined>;
    createAttendance(employee: Employee, company: Company, recordedBy: Staff, date: Date, timeIn: string, timeOut: string, signature: string): Promise<Attendance>;
    findByCompanyAndDateRange(company: Company, startDate: Date, endDate: Date): Promise<Attendance[]>;
    findByCompaniesAndDateRange(companies: Company[], startDate: Date, endDate: Date): Promise<Attendance[]>;
    findByEmployeeAndDateRange(employee: Employee, startDate: Date, endDate: Date): Promise<Attendance[]>;
}
