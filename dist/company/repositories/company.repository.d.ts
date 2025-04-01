import { DataSource, Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { UUID } from 'crypto';
export declare class CompanyRepository extends Repository<Company> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    findOneById(id: UUID): Promise<Company | undefined>;
}
