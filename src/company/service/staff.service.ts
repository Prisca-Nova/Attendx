import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StaffRepository } from 'src/company/repositories/staff.repository';
import { UserService } from 'src/user/service/user.service';
import { CompanyRepository } from 'src/company/repositories/company.repository';
import { Staff } from 'src/company/entities/staff.entity';
import { UUID } from 'crypto';
import { User, UserRole, UserStatus } from 'src/user/entities/user.entity';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly userService: UserService,
    private readonly companyRepository: CompanyRepository
  ) {}

  async createStaff(createStaffDto: CreateStaffDto, currentUser: User): Promise<Staff> {
    const user = await this.userService.getUserById(createStaffDto.userId);
    if (!user) {
        throw new NotFoundException('User not found');
    }
    if (user.status !== UserStatus.ACTIVE) {
        throw new BadRequestException('User is not active');
    }

    // Check if the company exists
    const company = await this.companyRepository.findOneById(createStaffDto.companyId);
    if (!company) {
        throw new NotFoundException('Company not found');
    }

    // Check if the current user is authorized to add staff
    if (currentUser.role !== UserRole.ADMIN) {
        const staffMember = await this.staffRepository.findByUserAndCompany(currentUser, company);
        if (!staffMember || !staffMember.canImportEmployees) {
            throw new BadRequestException('You are not authorized to add staff');
        }
    }

    // Check if the user is already a staff member
    const existingStaff = await this.staffRepository.findByUserAndCompany(user, company);
    if (existingStaff) {
        throw new BadRequestException('User is already a staff member');
    }

    // Create new staff member
    const staff = await this.staffRepository.createStaff(user, company, {
        canManageLunchAttendance: createStaffDto.canManageLunchAttendance ?? false,
        canInviteStaff: createStaffDto.canInviteStaff ?? false,
        canImportEmployees: createStaffDto.canImportEmployees ?? false,
        canRecordAttendance: createStaffDto.canRecordAttendance ?? false,
    });

    return staff;
}



  async getStaffById(id: UUID): Promise<Staff> {
    const staff = await this.staffRepository.findOneById(id);
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    return staff;
  }

  async getStaffByCompany(companyId: UUID): Promise<Staff[]> {
    const company = await this.companyRepository.findOneById(companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return await this.staffRepository.findByCompany(company);
  }

  async getStaffByUser(userId: UUID): Promise<Staff[]> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.staffRepository.findByUser(user);
  }

  async updateStaff(id: UUID, updateStaffDto: UpdateStaffDto, currentUser: User): Promise<Staff> {
    const staff = await this.staffRepository.findOneById(id);
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    // Check if the current user is authorized to update staff
    if (currentUser.role !== UserRole.ADMIN) {
      const adminStaff = await this.staffRepository.findByUserAndCompany(currentUser, staff.company);
      if (!adminStaff || !adminStaff.canImportEmployees) {
        throw new BadRequestException('You are not authorized to update staff');
      }
    }

    if (updateStaffDto.canManageLunchAttendance !== undefined) {
      staff.canManageLunchAttendance = updateStaffDto.canManageLunchAttendance;
    }
    
    if (updateStaffDto.canInviteStaff !== undefined) {
      staff.canInviteStaff = updateStaffDto.canInviteStaff;
    }
    
    if (updateStaffDto.canImportEmployees !== undefined) {
      staff.canImportEmployees = updateStaffDto.canImportEmployees;
    }

    return await this.staffRepository.save(staff);
  }

  async deleteStaff(id: UUID, currentUser: User): Promise<void> {
    const staff = await this.staffRepository.findOneById(id);
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    // Check if the current user is authorized to delete staff
    if (currentUser.role !== UserRole.ADMIN) {
      const adminStaff = await this.staffRepository.findByUserAndCompany(currentUser, staff.company);
      if (!adminStaff || !adminStaff.canInviteStaff) {
        throw new BadRequestException('You are not authorized to delete staff');
      }
    }
    await this.staffRepository.save(staff);
  }
}