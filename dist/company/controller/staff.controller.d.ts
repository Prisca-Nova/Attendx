import { StaffService } from '../service/staff.service';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';
import { HttpResponse } from 'src/common/dto/http-response';
import { Staff } from '../entities/staff.entity';
import { UUID } from 'crypto';
import { AuthenticatedRequest } from 'src/common/types/express';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    createStaff(createStaffDto: CreateStaffDto, req: AuthenticatedRequest): Promise<HttpResponse<Staff>>;
    getStaffById(id: UUID): Promise<HttpResponse<Staff>>;
    getStaffByCompany(companyId: UUID): Promise<HttpResponse<Staff[]>>;
    getStaffByUser(userId: UUID): Promise<HttpResponse<Staff[]>>;
    updateStaff(id: UUID, updateStaffDto: UpdateStaffDto, req: AuthenticatedRequest): Promise<HttpResponse<Staff>>;
    deleteStaff(id: UUID, req: AuthenticatedRequest): Promise<HttpResponse<null>>;
}
