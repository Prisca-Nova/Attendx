import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';

export class CreateCompanyDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsOptional()
  contact: string;
  @ApiProperty()
  @IsOptional()
  address: string;
  @ApiProperty()
  @IsOptional()
  description: string;
  @ApiProperty()
  @IsOptional()
  @IsBase64()
  logo: string;
  @ApiProperty()
  @IsUrl()
  @IsOptional()
  website: string;
}
