import { UUID } from 'crypto';
export declare class CreateAttendanceDto {
    employeeId: UUID;
    companyId: UUID;
    date: Date;
    timeIn: string;
    timeOut: string;
    signature: string;
}
export declare class UpdateAttendanceDto {
    employeeId?: UUID;
    date?: Date;
    timeIn?: string;
    timeOut?: string;
    signature?: string;
}
export declare class RecordLunchAttendanceDto {
    employeeId: UUID;
    date: Date;
    timeIn: string;
    timeOut?: string;
    signature: string;
}
