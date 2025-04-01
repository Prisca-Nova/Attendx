import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { Company } from '../../company/entities/company.entity';
import { Attendance } from '../../company/entities/attendance.entity';
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  PENDING_SUSPENSION = 'PENDING_SUSPENSION',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  COMPANY = 'COMPANY',
  CLIENT = 'CLIENT',
  EMPLOYEE = 'EMPLOYEE',
  STAFF = 'STAFF'
}
@Entity()
@Unique(['email'])
export class User extends BaseCoreEntity {
  @Column({ nullable: false })
  firstName: string;
  @Column({ nullable: false })
  lastName: string;
  @Column({ nullable: false })
  email: string;
  @Column({ nullable: true })
  password: string;
  @Column({ enum: UserRole, default: UserRole.COMPANY })
  role: UserRole;
  @OneToMany(() => Company, (company) => company.representative)
  companies: Company[];

  @Column({ enum: UserStatus, default: UserStatus.PENDING_VERIFICATION })
  status: UserStatus;

  @OneToMany(() => Attendance, (attendance) => attendance.recordedBy)
  attendanceRecorded: Attendance[];
}
