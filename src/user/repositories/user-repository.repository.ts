import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async getById(id: UUID): Promise<User | undefined> {
    return this.findOneBy({ id });
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOneBy({ email });
  }
}
