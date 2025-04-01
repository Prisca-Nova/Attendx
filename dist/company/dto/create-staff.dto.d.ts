export declare class CreateStaffDto {
    static userId(userId: any): void;
    userId: string;
    companyId: string;
    canManageLunchAttendance?: boolean;
    canInviteStaff?: boolean;
    canImportEmployees?: boolean;
}
