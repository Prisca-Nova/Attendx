import { StaffRepository } from 'src/company/repositories/staff.repository';
import { UserService } from 'src/user/service/user.service';
import { CompanyRepository } from 'src/company/repositories/company.repository';
import { Staff } from 'src/company/entities/staff.entity';
import { UUID } from 'crypto';
import { User } from 'src/user/entities/user.entity';
import { CreateStaffDto } from '../dto/create-staff.dto';
import { UpdateStaffDto } from '../dto/update-staff.dto';
export declare class StaffService {
    private readonly staffRepository;
    private readonly userService;
    private readonly companyRepository;
    private readonly createStaffDto;
    constructor(staffRepository: StaffRepository, userService: UserService, companyRepository: CompanyRepository, createStaffDto: CreateStaffDto);
    createStaff(createStaffDto: any, currentUser: User): Promise<Staff>;
    getStaffById(id: UUID): Promise<Staff>;
    getStaffByCompany(companyId: UUID): Promise<Staff[]>;
    getStaffByUser(userId: UUID): Promise<Staff[]>;
    updateStaff(id: UUID, updateStaffDto: UpdateStaffDto, currentUser: User): Promise<Staff>;
    deleteStaff(id: UUID, currentUser: User): Promise<void>;
}
