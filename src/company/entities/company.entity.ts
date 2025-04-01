import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Employee } from './employee.entity';
import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { Attendance } from './attendance.entity';
import { Staff } from './staff.entity';

@Entity()
@Unique(['email'])
export class Company extends BaseCoreEntity {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  email: string;
  @Column({ nullable: true })
  contact: string;
  @ManyToOne(() => User, (user) => user.companies)
  representative: User;

  @OneToMany(() => Employee, (employee) => employee.company, { cascade: true })
  employees: Employee[];
  @OneToMany(() => Staff, (staff) => staff.company, { cascade: true })
  staff: Staff[];

  @OneToMany(() => Attendance, (attendance) => attendance.company)
  attendances: Attendance[];
}
