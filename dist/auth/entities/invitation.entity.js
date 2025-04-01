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
exports.Invitation = exports.InvitationType = exports.InvitationStatus = void 0;
const typeorm_1 = require("typeorm");
const base_core_entity_1 = require("../../common/entity/base-core-entity");
const user_entity_1 = require("../../user/entities/user.entity");
const company_entity_1 = require("../../company/entities/company.entity");
var InvitationStatus;
(function (InvitationStatus) {
    InvitationStatus["PENDING"] = "PENDING";
    InvitationStatus["ACCEPTED"] = "ACCEPTED";
    InvitationStatus["REJECTED"] = "REJECTED";
})(InvitationStatus || (exports.InvitationStatus = InvitationStatus = {}));
var InvitationType;
(function (InvitationType) {
    InvitationType["USER"] = "USER";
    InvitationType["STAFF"] = "STAFF";
    InvitationType["EMPLOYEE"] = "EMPLOYEE";
})(InvitationType || (exports.InvitationType = InvitationType = {}));
let Invitation = class Invitation extends base_core_entity_1.BaseCoreEntity {
};
exports.Invitation = Invitation;
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Invitation.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Invitation.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Invitation.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Invitation.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: InvitationStatus.PENDING, enum: InvitationStatus }),
    __metadata("design:type", String)
], Invitation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: InvitationType.USER, enum: InvitationType }),
    __metadata("design:type", String)
], Invitation.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Invitation.prototype, "invitedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => company_entity_1.Company),
    __metadata("design:type", company_entity_1.Company)
], Invitation.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, nullable: true }),
    __metadata("design:type", Boolean)
], Invitation.prototype, "canManageAttendance", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, nullable: true }),
    __metadata("design:type", Boolean)
], Invitation.prototype, "canInviteStaff", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, nullable: true }),
    __metadata("design:type", Boolean)
], Invitation.prototype, "canImportEmployees", void 0);
exports.Invitation = Invitation = __decorate([
    (0, typeorm_1.Entity)()
], Invitation);
//# sourceMappingURL=invitation.entity.js.map