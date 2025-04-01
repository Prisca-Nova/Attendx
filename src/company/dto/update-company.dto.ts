import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiProperty()
  @IsUUID()
  representativeId: UUID;
}
