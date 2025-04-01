import { BaseCoreEntity } from '../../common/entity/base-core-entity';
import { User } from '../../user/entities/user.entity';
import { Invitation } from './invitation.entity';
export declare class OTP extends BaseCoreEntity {
    otp: string;
    user?: User;
    invitation?: Invitation;
    isActive: boolean;
    get isExpired(): boolean;
}
