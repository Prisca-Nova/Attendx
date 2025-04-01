import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { Company } from './company.entity';
import { User } from '../../user/entities/user.entity';
import { Attendance } from './attendance.entity';
export declare class Staff extends BaseCoreEntity {
    position: string;
    department: string;
    canRecordAttendance: boolean;
    company: Company;
    user: User;
    canImportEmployees: boolean;
    canManageLunchAttendance: boolean;
    canInviteStaff: boolean;
    recordedAttendances: Attendance[];
}
