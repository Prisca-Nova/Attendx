import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateStaffDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: UUID;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  companyId: UUID;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canManageLunchAttendance?: boolean = false;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canInviteStaff?: boolean = false;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canImportEmployees?: boolean = false;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canRecordAttendance?: boolean = false;
  
}
