import { UUID } from 'crypto';
import { HttpResponse } from 'src/common/dto/http-response';
import { LunchAttendanceService } from '../service/attendance.service';
import { CreateAttendanceDto, RecordLunchAttendanceDto, UpdateAttendanceDto } from '../dto/attendance.dto';
import { Attendance } from '../entities/attendance.entity';
import { EmployeeService } from '../service/employee.service';
export declare class AttendanceController {
    private readonly attendanceService;
    private readonly employeeService;
    constructor(attendanceService: LunchAttendanceService, employeeService: EmployeeService);
    getAllAttendances(req: any, startDate?: Date, endDate?: Date, employeeId?: UUID): Promise<HttpResponse<Attendance[]>>;
    getAttendanceById(id: UUID): Promise<HttpResponse<Attendance>>;
    createAttendance(req: any, createAttendanceDto: CreateAttendanceDto): Promise<HttpResponse<Attendance>>;
    updateAttendance(id: UUID, updateAttendanceDto: UpdateAttendanceDto, req: any): Promise<HttpResponse<Attendance>>;
    recordLunchAttendance(recordLunchAttendanceDto: RecordLunchAttendanceDto, req: any): Promise<HttpResponse<Attendance>>;
}
