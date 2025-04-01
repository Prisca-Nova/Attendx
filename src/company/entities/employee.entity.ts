import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { Company } from './company.entity';

@Entity()
@Unique(['email', 'employeeId'])
export class Employee extends BaseCoreEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  contact: string;

  @ManyToOne(() => Company, (company) => company.employees)
  company: Company;

  @Column()
  employeeId: string;
}
