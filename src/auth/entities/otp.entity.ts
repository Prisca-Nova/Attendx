import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { User } from '../../user/entities/user.entity';
import { DateTime } from 'luxon';
import { Invitation } from './invitation.entity';

@Entity()
@Unique(['otp', 'user'])
export class OTP extends BaseCoreEntity {
  @Column()
  otp: string;

  @ManyToOne(() => User)
  user?: User;
  @ManyToOne(() => Invitation, { cascade: true })
  @JoinColumn()
  invitation?: Invitation;
  @Column({ default: true })
  isActive: boolean;

  get isExpired(): boolean {
    const expirationTime = DateTime.fromJSDate(this.createdAt).plus({
      minutes: 15,
    });
    return DateTime.now() > expirationTime;
  }
}
