import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LunchAttendanceRepository } from '../repositories/attendance.repository';
import { CompanyRepository } from '../repositories/company.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { StaffRepository } from '../repositories/staff.repository';
import { UUID } from 'crypto';
import { Attendance } from '../entities/attendance.entity';
import { CreateAttendanceDto } from '../dto/attendance.dto';
import { User, UserRole } from '../../user/entities/user.entity';
import { Staff } from '../entities/staff.entity';
import { In } from 'typeorm';

@Injectable()
export class LunchAttendanceService {
  constructor(
    private readonly lunchAttendanceRepository: LunchAttendanceRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly staffRepository: StaffRepository
    // Removed CreateAttendanceDto injection from here
  ) {}

  async createLunchAttendance(
    createLunchAttendanceDto: CreateAttendanceDto,
    currentUser: User,
  ): Promise<Attendance> {
    // Validate company
    const company = await this.companyRepository.findOneById(createLunchAttendanceDto.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
  
    // Validate employee
    const employee = await this.employeeRepository.findOneById(createLunchAttendanceDto.employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
  
    // Check if the employee belongs to the company
    if (employee.company.id !== company.id) {
      throw new BadRequestException('Employee does not belong to the company');
    }
  
    // Validate staff permissions
    let staff: Staff;
  
    if (currentUser.role === UserRole.ADMIN) {
      // Admin can record lunch attendance for any company
      staff = await this.staffRepository.findOne({
        where: { user: { id: currentUser.id }, company: { id: company.id } },
        relations: ['user', 'company'],  // Ensure related entities are loaded
      });
  
      // If admin doesn't have a staff record yet, create one
      if (!staff) {
        staff = this.staffRepository.create({
          user: currentUser,
          company,
        });
        staff = await this.staffRepository.save(staff);
      }
    } else {
      // Regular user needs to be staff with lunch attendance permissions
      staff = await this.staffRepository.findByUserAndCompany(currentUser, company);
  
      if (!staff || !staff.canRecordAttendance) {
        throw new BadRequestException('You are not authorized to record lunch attendance');
      }
    }
  
    // Create lunch attendance record
    const lunchAttendance = this.lunchAttendanceRepository.createAttendance(
      employee,
      company,
      staff,
      new Date(createLunchAttendanceDto.date),
      createLunchAttendanceDto.timeIn,
      createLunchAttendanceDto.timeOut,
      createLunchAttendanceDto.signature,
    );
  
    return lunchAttendance
  }
  

  async getLunchAttendanceById(id: UUID): Promise<Attendance> {
    const lunchAttendance = await this.lunchAttendanceRepository.findOneById(id);
    if (!lunchAttendance) {
      throw new NotFoundException('Lunch attendance record not found');
    }
    return lunchAttendance;
  }

  async getLunchAttendanceByCompanyAndDateRange(
    companyId: UUID,
    startDate: string,
    endDate: string,
    currentUser: User,
  ): Promise<Attendance[]> {
    const company = await this.companyRepository.findOneById(companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Check permissions
    if (currentUser.role !== UserRole.ADMIN) {
      const staff = await this.staffRepository.findByUserAndCompany(currentUser, company);
      if (!staff || (!staff.canRecordAttendance)) {
        throw new BadRequestException('You are not authorized to view lunch attendance records');
      }
    }

    return await this.lunchAttendanceRepository.findByCompanyAndDateRange(
      company,
      new Date(startDate),
      new Date(endDate),
    );
  }

  async getLunchAttendanceByEmployeeAndDateRange(
    employeeId: UUID,
    startDate: string,
    endDate: string,
    currentUser: User,
  ): Promise<Attendance[]> {
    const employee = await this.employeeRepository.findOneById(employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Check permissions
    if (currentUser.role !== UserRole.ADMIN) {
      const staff = await this.staffRepository.findByUserAndCompany(currentUser, employee.company);
      if (!staff || (!staff.canRecordAttendance)) {
        throw new BadRequestException('You are not authorized to view lunch attendance records');
      }
    }

    return await this.lunchAttendanceRepository.findByEmployeeAndDateRange(
      employee,
      new Date(startDate),
      new Date(endDate),
    );
  }

  async getAllAttendances(
    currentUser: User,
    startDate: Date,
    endDate: Date,
    employeeId?: UUID
  ): Promise<Attendance[]> {
    if (currentUser.role === UserRole.STAFF && employeeId) {
      const employee = await this.employeeRepository.findOneById(employeeId);
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }
  
      return await this.lunchAttendanceRepository.findByEmployeeAndDateRange(
        employee,
        new Date(startDate),
        new Date(endDate)
      );
    }
  
    // Get staff records for the user
    const staff = await this.staffRepository.findByUser(currentUser);
    if (!staff || staff.length === 0) {
      throw new BadRequestException('You are not authorized to view lunch attendance records');
    }
  
    // Fetch company entities based on IDs
    const companyIds = staff.map(s => s.company.id);
    const companies = await this.companyRepository.findBy({
      id: In(companyIds),
    });
  
    return await this.lunchAttendanceRepository.findByCompaniesAndDateRange(
      companies,
      new Date(startDate),
      new Date(endDate)
    );
  }
  
  async updateAttendance(
    id: UUID,
    updateData: Partial<CreateAttendanceDto>,
    currentUser: User,
  ): Promise<Attendance> {
    const attendance = await this.lunchAttendanceRepository.findOneById(id);
    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    // Check permissions
    if (currentUser.role !== UserRole.ADMIN) {
      const staff = await this.staffRepository.findByUserAndCompany(currentUser, attendance.company);
      if (!staff || !staff.canRecordAttendance) {
        throw new BadRequestException('You are not authorized to update this attendance record');
      }
    }

    Object.assign(attendance, updateData);
    return await this.lunchAttendanceRepository.save(attendance);
  }
}