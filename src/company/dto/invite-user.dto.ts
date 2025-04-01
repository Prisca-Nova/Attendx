import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsEnum, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { UserRole } from 'src/user/entities/user.entity';
import { InvitationType } from 'src/auth/entities/invitation.entity';

export class InviteUserDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: UserRole, default: UserRole.EMPLOYEE })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ enum: InvitationType, default: InvitationType.USER })
  @IsEnum(InvitationType)
  type: InvitationType;

  @ApiProperty()
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canManageAttendance?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canManageLunchAttendance?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canInviteStaff?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canImportEmployees?: boolean;
}
