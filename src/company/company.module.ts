import { Module } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { CompanyController, EmployeeController } from './controller/company.controller';
import { CompanyRepository } from './repositories/company.repository';
import { EmployeeRepository } from './repositories/employee.repository';
import { UserModule } from 'src/user/user.module';
import { InvitationRepository } from 'src/auth/repositories/invitation.repository';
import { OTPRepository } from 'src/auth/repositories/otp.repository';
import { StaffRepository } from './repositories/staff.repository';
import { StaffService } from './service/staff.service';
import { StaffController } from './controller/staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { EmployeeService } from './service/employee.service';
import { AttendanceController } from './controller/attendance.controller';
import { LunchAttendanceService } from './service/attendance.service';
import { LunchAttendanceRepository } from './repositories/attendance.repository';

@Module({
  controllers: [CompanyController, EmployeeController,

    StaffController, AttendanceController
  ],
  providers: [
    LunchAttendanceService,
    LunchAttendanceRepository,
    CompanyService, 
    CompanyRepository, 
    EmployeeRepository,
    EmployeeService, 
    StaffRepository,
    InvitationRepository,
    OTPRepository,
    StaffService
  ],
  imports: [UserModule,
    TypeOrmModule.forFeature([Staff]),
  ]
})
export class CompanyModule {}
