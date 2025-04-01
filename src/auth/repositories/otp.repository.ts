import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OTP } from '../entities/otp.entity';

@Injectable()
export class OTPRepository extends Repository<OTP> {
  constructor(private readonly dataSource: DataSource) {
    super(OTP, dataSource.createEntityManager());
  }
  async findByOtp(otp: string): Promise<OTP | undefined> {
    return await this.findOne({ where: { otp: otp } });
  }
}
