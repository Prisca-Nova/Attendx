import { LunchAttendanceRepository } from '../repositories/attendance.repository';
import { CompanyRepository } from '../repositories/company.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { StaffRepository } from '../repositories/staff.repository';
import { UUID } from 'crypto';
import { Attendance } from '../entities/attendance.entity';
import { CreateAttendanceDto } from '../dto/attendance.dto';
import { User } from '../../user/entities/user.entity';
export declare class LunchAttendanceService {
    private readonly lunchAttendanceRepository;
    private readonly companyRepository;
    private readonly employeeRepository;
    private readonly staffRepository;
    private readonly createLunchAttendanceDto;
    constructor(lunchAttendanceRepository: LunchAttendanceRepository, companyRepository: CompanyRepository, employeeRepository: EmployeeRepository, staffRepository: StaffRepository, createLunchAttendanceDto: CreateAttendanceDto);
    createLunchAttendance(createLunchAttendanceDto: CreateAttendanceDto, currentUser: User): Promise<Attendance>;
    getLunchAttendanceById(id: UUID): Promise<Attendance>;
    getLunchAttendanceByCompanyAndDateRange(companyId: UUID, startDate: string, endDate: string, currentUser: User): Promise<Attendance[]>;
    getLunchAttendanceByEmployeeAndDateRange(employeeId: UUID, startDate: string, endDate: string, currentUser: User): Promise<Attendance[]>;
    getAllAttendances(currentUser: User, startDate: Date, endDate: Date, employeeId?: UUID): Promise<Attendance[]>;
    updateAttendance(id: UUID, updateData: Partial<CreateAttendanceDto>, currentUser: User): Promise<Attendance>;
}
