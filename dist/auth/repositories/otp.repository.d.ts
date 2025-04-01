import { DataSource, Repository } from 'typeorm';
import { OTP } from '../entities/otp.entity';
export declare class OTPRepository extends Repository<OTP> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    findByOtp(otp: string): Promise<OTP | undefined>;
}
