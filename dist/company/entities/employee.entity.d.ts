import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { Company } from './company.entity';
export declare class Employee extends BaseCoreEntity {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    company: Company;
    employeeId: string;
}
