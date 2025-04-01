import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { Employee } from './employee.entity';
import { Company } from './company.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Attendance extends BaseCoreEntity {
  @ManyToOne(()=>Employee, {nullable: true})
  @JoinColumn()
  employee: Employee;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  timeIn: string;

  @Column({ type: 'time' })
  timeOut: string;

  @ManyToOne(() => Company, (company) => company.attendances)
  company: Company;

  @ManyToOne(() => User, (user) => user.attendanceRecorded)
  recordedBy: User;

  @Column({ type: 'text' })
  signature: string;
}
