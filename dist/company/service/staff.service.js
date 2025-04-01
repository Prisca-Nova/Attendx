"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const staff_repository_1 = require("../repositories/staff.repository");
const user_service_1 = require("../../user/service/user.service");
const company_repository_1 = require("../repositories/company.repository");
const user_entity_1 = require("../../user/entities/user.entity");
const create_staff_dto_1 = require("../dto/create-staff.dto");
let StaffService = class StaffService {
    constructor(staffRepository, userService, companyRepository, createStaffDto) {
        this.staffRepository = staffRepository;
        this.userService = userService;
        this.companyRepository = companyRepository;
        this.createStaffDto = createStaffDto;
    }
    async createStaff(createStaffDto, currentUser) {
        const user = await this.userService.getUserById(createStaffDto.userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.status !== user_entity_1.UserStatus.ACTIVE) {
            throw new common_1.BadRequestException('User is not active');
        }
        const company = await this.companyRepository.findOneById(createStaffDto.companyId);
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        if (currentUser.role !== user_entity_1.UserRole.ADMIN) {
            const staffMember = await this.staffRepository.findByUserAndCompany(currentUser, company);
            if (!staffMember || !staffMember.canImportEmployees) {
                throw new common_1.BadRequestException('You are not authorized to add staff');
            }
        }
        const existingStaff = await this.staffRepository.findByUserAndCompany(user, company);
        if (existingStaff) {
            throw new common_1.BadRequestException('User is already a staff member');
        }
        const staff = await this.staffRepository.createStaff(user, company, {
            position: createStaffDto.position ?? 'Unknown',
            canManageLunchAttendance: createStaffDto.canManageLunchAttendance ?? false,
            canInviteStaff: createStaffDto.canInviteStaff ?? false,
            canImportEmployees: createStaffDto.canImportEmployees ?? false,
            canRecordAttendance: createStaffDto.canRecordAttendance ?? false,
        });
        return staff;
    }
    async getStaffById(id) {
        const staff = await this.staffRepository.findOneById(id);
        if (!staff) {
            throw new common_1.NotFoundException('Staff not found');
        }
        return staff;
    }
    async getStaffByCompany(companyId) {
        const company = await this.companyRepository.findOneById(companyId);
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        return await this.staffRepository.findByCompany(company);
    }
    async getStaffByUser(userId) {
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return await this.staffRepository.findByUser(user);
    }
    async updateStaff(id, updateStaffDto, currentUser) {
        const staff = await this.staffRepository.findOneById(id);
        if (!staff) {
            throw new common_1.NotFoundException('Staff not found');
        }
        if (currentUser.role !== user_entity_1.UserRole.ADMIN) {
            const adminStaff = await this.staffRepository.findByUserAndCompany(currentUser, staff.company);
            if (!adminStaff || !adminStaff.canImportEmployees) {
                throw new common_1.BadRequestException('You are not authorized to update staff');
            }
        }
        if (updateStaffDto.canManageLunchAttendance !== undefined) {
            staff.canManageLunchAttendance = updateStaffDto.canManageLunchAttendance;
        }
        if (updateStaffDto.canInviteStaff !== undefined) {
            staff.canInviteStaff = updateStaffDto.canInviteStaff;
        }
        if (updateStaffDto.canImportEmployees !== undefined) {
            staff.canImportEmployees = updateStaffDto.canImportEmployees;
        }
        return await this.staffRepository.save(staff);
    }
    async deleteStaff(id, currentUser) {
        const staff = await this.staffRepository.findOneById(id);
        if (!staff) {
            throw new common_1.NotFoundException('Staff not found');
        }
        if (currentUser.role !== user_entity_1.UserRole.ADMIN) {
            const adminStaff = await this.staffRepository.findByUserAndCompany(currentUser, staff.company);
            if (!adminStaff || !adminStaff.canInviteStaff) {
                throw new common_1.BadRequestException('You are not authorized to delete staff');
            }
        }
        await this.staffRepository.save(staff);
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [staff_repository_1.StaffRepository,
        user_service_1.UserService,
        company_repository_1.CompanyRepository,
        create_staff_dto_1.CreateStaffDto])
], StaffService);
//# sourceMappingURL=staff.service.js.map