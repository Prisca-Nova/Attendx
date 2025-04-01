import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { UUID } from 'crypto';

@Injectable()
export class CompanyRepository extends Repository<Company> {
  constructor(private readonly dataSource: DataSource) {
    super(Company, dataSource.createEntityManager());
  }
  async findOneById(id: UUID): Promise<Company | undefined> {
    return await this.findOne({ where: { id: id } });
  }
}
