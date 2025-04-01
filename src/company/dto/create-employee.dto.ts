import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Company } from '../entities/company.entity';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty()
  contact: string;

  @ApiProperty()
  @IsNotEmpty()
  company: Company;
}
