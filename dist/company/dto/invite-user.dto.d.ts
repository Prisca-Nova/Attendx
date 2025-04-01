import { UserRole } from 'src/user/entities/user.entity';
import { InvitationType } from 'src/auth/entities/invitation.entity';
export declare class InviteUserDto {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    type: InvitationType;
    companyId: string;
    canManageAttendance?: boolean;
    canManageLunchAttendance?: boolean;
    canInviteStaff?: boolean;
    canImportEmployees?: boolean;
}
