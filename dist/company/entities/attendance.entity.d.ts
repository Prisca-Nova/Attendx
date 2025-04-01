import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { Employee } from './employee.entity';
import { Company } from './company.entity';
import { User } from '../../user/entities/user.entity';
export declare class Attendance extends BaseCoreEntity {
    employee: Employee;
    date: Date;
    timeIn: string;
    timeOut: string;
    company: Company;
    recordedBy: User;
    signature: string;
}
