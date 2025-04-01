"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const staff_entity_1 = require("../company/entities/staff.entity");
const staff_repository_1 = require("../company/repositories/staff.repository");
const company_repository_1 = require("../company/repositories/company.repository");
const invitation_repository_1 = require("../auth/repositories/invitation.repository");
const otp_repository_1 = require("../auth/repositories/otp.repository");
const email_module_1 = require("../email/email.module");
const user_module_1 = require("../user/user.module");
const employee_import_controller_1 = require("./employee-import.controller");
const employee_repository_1 = require("../company/repositories/employee.repository");
let StaffModule = class StaffModule {
};
exports.StaffModule = StaffModule;
exports.StaffModule = StaffModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([staff_entity_1.Staff]),
            email_module_1.EmailModule,
            user_module_1.UserModule,
        ],
        controllers: [
            employee_import_controller_1.EmployeeImportController,
        ],
        providers: [
            staff_repository_1.StaffRepository,
            company_repository_1.CompanyRepository,
            invitation_repository_1.InvitationRepository,
            otp_repository_1.OTPRepository,
            employee_repository_1.EmployeeRepository
        ],
    })
], StaffModule);
//# sourceMappingURL=staff.module.js.map