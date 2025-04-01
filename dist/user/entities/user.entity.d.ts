import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { Company } from '../../company/entities/company.entity';
import { Attendance } from '../../company/entities/attendance.entity';
export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED",
    EXPIRED = "EXPIRED",
    SUSPENDED = "SUSPENDED",
    PENDING_SUSPENSION = "PENDING_SUSPENSION",
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
}
export declare enum UserRole {
    ADMIN = "ADMIN",
    COMPANY = "COMPANY",
    CLIENT = "CLIENT",
    EMPLOYEE = "EMPLOYEE",
    STAFF = "STAFF"
}
export declare class User extends BaseCoreEntity {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    companies: Company[];
    status: UserStatus;
    attendanceRecorded: Attendance[];
}
