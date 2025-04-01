import { User } from '../../user/entities/user.entity';
import { Employee } from './employee.entity';
import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { Attendance } from './attendance.entity';
import { Staff } from './staff.entity';
export declare class Company extends BaseCoreEntity {
    name: string;
    address: string;
    email: string;
    contact: string;
    representative: User;
    employees: Employee[];
    staff: Staff[];
    attendances: Attendance[];
}
