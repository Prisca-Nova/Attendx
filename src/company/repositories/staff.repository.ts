import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { UUID } from 'crypto';
import { Company } from '../entities/company.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class StaffRepository extends Repository<Staff> {
  constructor(private readonly dataSource: DataSource) {
    super(Staff, dataSource.createEntityManager());
  }

  async createStaff(user: User, company: Company, permissions: Partial<Staff>): Promise<Staff> {
    const staff = this.create({
      user,
      company,
      ...permissions,
    });
    return await this.save(staff);
}


  async findOneById(id: UUID): Promise<Staff | undefined> {
    return await this.findOne({ 
      where: { id: id },
      relations: ['user', 'company']
    });
  }

  async findByCompany(company: Company): Promise<Staff[]> {
    return await this.find({ 
    where: { company: {id: company.id }},
      relations: ['user']
    });
  }

  async findByUser(user: User): Promise<Staff[]> {
    return await this.find({ 
      where: { user: { id: user.id }},
      relations: ['company']
    });
  }

  async findByUserAndCompany(user: User, company: Company): Promise<Staff | undefined> {
    return await this.findOne({
      where: { 
        user: { id: user.id }, 
        company: { id: company.id },
      }
    });
  }
}