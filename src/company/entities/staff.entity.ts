import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { Company } from './company.entity';
import { User } from '../../user/entities/user.entity';
import { Attendance } from './attendance.entity';

@Entity()
export class Staff extends BaseCoreEntity {
  
  @Column({ nullable: true })
  department: string;
  
  @Column({ default: true })
  canRecordAttendance: boolean;
  
  @ManyToOne(() => Company, (company) => company.staff)
  company: Company;
  
  @ManyToOne(() => User)
  user: User;

  @Column({default: true})
  canImportEmployees: boolean

  @Column({default: true})
  canManageLunchAttendance: boolean

  @Column({default: true})
  canInviteStaff: boolean
  
  @OneToMany(() => Attendance, (attendance) => attendance.recordedBy)
  recordedAttendances: Attendance[];
}