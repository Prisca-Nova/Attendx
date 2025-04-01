import { LunchAttendanceRepository } from '../repositories/attendance.repository';
import { CompanyRepository } from '../repositories/company.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
export declare class AttendanceCronService {
    private readonly attendanceRepository;
    private readonly companyRepository;
    private readonly employeeRepository;
    private readonly logger;
    constructor(attendanceRepository: LunchAttendanceRepository, companyRepository: CompanyRepository, employeeRepository: EmployeeRepository);
    createLunchAttendanceRecords(): Promise<void>;
    checkMissingAttendanceRecords(): Promise<void>;
}
