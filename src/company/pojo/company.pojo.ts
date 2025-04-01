import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class CompanyPojo {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  contact: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  logo: string;
  @ApiProperty()
  website: string;
  representative: User;
}
