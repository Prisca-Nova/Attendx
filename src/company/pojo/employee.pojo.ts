import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';

export class EmployeePojo {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  contact: string;

  @ApiProperty()
  company: Company;

  @ApiProperty()
  employeeId: string;
}
