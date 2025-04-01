import { CreateCompanyDto } from './create-company.dto';
import { UUID } from 'crypto';
declare const UpdateCompanyDto_base: import("@nestjs/common").Type<Partial<CreateCompanyDto>>;
export declare class UpdateCompanyDto extends UpdateCompanyDto_base {
    representativeId: UUID;
}
export {};
