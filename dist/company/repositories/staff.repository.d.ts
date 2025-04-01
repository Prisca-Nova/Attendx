import { DataSource, Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { UUID } from 'crypto';
import { Company } from '../entities/company.entity';
import { User } from '../../user/entities/user.entity';
export declare class StaffRepository extends Repository<Staff> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createStaff(user: User, company: Company, permissions: Partial<Staff>): Promise<Staff>;
    findOneById(id: UUID): Promise<Staff | undefined>;
    findByCompany(company: Company): Promise<Staff[]>;
    findByUser(user: User): Promise<Staff[]>;
    findByUserAndCompany(user: User, company: Company): Promise<Staff | undefined>;
}
