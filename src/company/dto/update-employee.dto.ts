// employee.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
import { UUID } from 'crypto';

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ description: 'Employee first name' })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  firstName?: string;

  @ApiPropertyOptional({ description: 'Employee last name' })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  lastName?: string;

  @ApiPropertyOptional({ description: 'Employee email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Employee phone number' })
  @IsString()
  @IsOptional()
  @Matches(/^\+?[0-9]{10,15}$/, { message: 'Phone number must be valid' })
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Employee department ID' })
  @IsUUID()
  @IsOptional()
  departmentId?: UUID;

  @ApiPropertyOptional({ description: 'Employee position or job title' })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ description: 'Employee status' })
  @IsEnum(['ACTIVE', 'INACTIVE', 'ON_LEAVE'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Employee address' })
  @IsString()
  @IsOptional()
  address?: string;
}