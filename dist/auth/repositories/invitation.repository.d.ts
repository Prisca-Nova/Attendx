import { DataSource, Repository } from 'typeorm';
import { Invitation } from '../entities/invitation.entity';
export declare class InvitationRepository extends Repository<Invitation> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    findOneByEmail(email: string): Promise<Invitation | undefined>;
}
