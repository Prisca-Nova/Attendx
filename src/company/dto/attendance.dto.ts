import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  employeeId: UUID;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  companyId: UUID;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  timeIn: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  timeOut: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  signature: string;
}

export class UpdateAttendanceDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  employeeId?: UUID;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  date?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  timeIn?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  timeOut?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  signature?: string;
}

export class RecordLunchAttendanceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  employeeId: UUID;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  timeIn: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  timeOut?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  signature: string;
}