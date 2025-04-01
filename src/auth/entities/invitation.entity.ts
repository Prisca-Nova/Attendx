import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { User, UserRole } from '../../user/entities/user.entity';
import { Company } from '../../company/entities/company.entity';

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum InvitationType {
  USER = 'USER',
  STAFF = 'STAFF',
  EMPLOYEE = 'EMPLOYEE'
}

@Entity()
export class Invitation extends BaseCoreEntity {
  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  role: UserRole;

  @Column({ default: InvitationStatus.PENDING, enum: InvitationStatus })
  status: InvitationStatus;

  @Column({default: InvitationType.USER, enum: InvitationType})
  type: InvitationType

  @ManyToMany(() => User)
  invitedBy: User;

  @ManyToMany(() => Company)
  company?: Company;

  @Column({default: false, nullable: true})
  canManageAttendance?: boolean;

  @Column({ default: false, nullable: true })
  canInviteStaff?: boolean;

  @Column({ default: false, nullable: true })
  canImportEmployees?: boolean;
}
