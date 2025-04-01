import { UUID } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UserRepository extends Repository<User> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    getById(id: UUID): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
}
