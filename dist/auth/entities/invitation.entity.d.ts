import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { User, UserRole } from '../../user/entities/user.entity';
import { Company } from '../../company/entities/company.entity';
export declare enum InvitationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}
export declare enum InvitationType {
    USER = "USER",
    STAFF = "STAFF",
    EMPLOYEE = "EMPLOYEE"
}
export declare class Invitation extends BaseCoreEntity {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    status: InvitationStatus;
    type: InvitationType;
    invitedBy: User;
    company?: Company;
    canManageAttendance?: boolean;
    canInviteStaff?: boolean;
    canImportEmployees?: boolean;
}
