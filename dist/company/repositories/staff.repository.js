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
exports.StaffRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("../entities/staff.entity");
let StaffRepository = class StaffRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(staff_entity_1.Staff, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async createStaff(user, company, permissions) {
        const staff = this.create({
            user,
            company,
            ...permissions,
        });
        return await this.save(staff);
    }
    async findOneById(id) {
        return await this.findOne({
            where: { id: id },
            relations: ['user', 'company']
        });
    }
    async findByCompany(company) {
        return await this.find({
            where: { company: { id: company.id } },
            relations: ['user']
        });
    }
    async findByUser(user) {
        return await this.find({
            where: { user: { id: user.id } },
            relations: ['company']
        });
    }
    async findByUserAndCompany(user, company) {
        return await this.findOne({
            where: {
                user: { id: user.id },
                company: { id: company.id },
            }
        });
    }
};
exports.StaffRepository = StaffRepository;
exports.StaffRepository = StaffRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], StaffRepository);
//# sourceMappingURL=staff.repository.js.map