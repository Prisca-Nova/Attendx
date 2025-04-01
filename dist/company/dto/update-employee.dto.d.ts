import { UUID } from 'crypto';
export declare class UpdateEmployeeDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    departmentId?: UUID;
    position?: string;
    status?: string;
    address?: string;
}
