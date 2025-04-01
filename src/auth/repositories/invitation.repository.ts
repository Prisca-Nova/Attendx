import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Invitation } from '../entities/invitation.entity';

@Injectable()
export class InvitationRepository extends Repository<Invitation> {
  constructor(private readonly dataSource: DataSource) {
    super(Invitation, dataSource.createEntityManager());
  }
  async findOneByEmail(email: string): Promise<Invitation | undefined> {
    return await this.findOne({ where: { email } });
  }
}
