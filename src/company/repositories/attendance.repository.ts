import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Between, In } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { UUID } from 'crypto';
import { Company } from '../entities/company.entity';
import { Staff } from '../entities/staff.entity';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class LunchAttendanceRepository extends Repository<Attendance> {
  constructor(private readonly dataSource: DataSource) {
    super(Attendance, dataSource.createEntityManager());
  }

  async findOneById(id: UUID): Promise<Attendance | undefined> {
    return await this.findOne({ 
      where: { id: id },
      relations: ['employee', 'company', 'recordedBy', 'recordedBy.user']
    });
  }

  async createAttendance(
    employee: Employee,
    company: Company,
    recordedBy: Staff,
    date: Date,
    timeIn: string,
    timeOut: string,
    signature: string
  ): Promise<Attendance> {
    const attendance = this.create({
      employee,
      company,
      recordedBy,
      date,
      timeIn,
      timeOut,
      signature,
    });
  
    return await this.save(attendance);
  }
  

  async findByCompanyAndDateRange(
    company: Company, 
    startDate: Date, 
    endDate: Date
  ): Promise<Attendance[]> {
    return await this.find({
      where: {
        company: { id: company.id },
        date: Between(startDate, endDate)
      },
      relations: ['employee', 'recordedBy', 'recordedBy.user'],
      order: { date: 'DESC', timeIn: 'ASC' }
    })
  }

  async findByCompaniesAndDateRange(
    companies: Company[], 
    startDate: Date, 
    endDate: Date
  ): Promise<Attendance[]> {
    return await this.find({
      where: {
        company: In(companies.map(company => company.id)), // Fix for handling multiple companies
        date: Between(startDate, endDate),
      },
      relations: ['employee', 'recordedBy', 'recordedBy.user'],
      order: { date: 'DESC', timeIn: 'ASC' },
    });
  }

  async findByEmployeeAndDateRange(
    employee: Employee,
    startDate: Date,
    endDate: Date
  ): Promise<Attendance[]> {
    return await this.find({
      where: {
        employee: { id: employee.id },
        date: Between(startDate, endDate)
      },
      relations: ['recordedBy', 'recordedBy.user'],
      order: { date: 'DESC', timeIn: 'ASC' }
    });
  }
}