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
exports.OTP = void 0;
const typeorm_1 = require("typeorm");
const base_core_entity_1 = require("../../common/entity/base-core-entity");
const user_entity_1 = require("../../user/entities/user.entity");
const luxon_1 = require("luxon");
const invitation_entity_1 = require("./invitation.entity");
let OTP = class OTP extends base_core_entity_1.BaseCoreEntity {
    get isExpired() {
        const expirationTime = luxon_1.DateTime.fromJSDate(this.createdAt).plus({
            minutes: 15,
        });
        return luxon_1.DateTime.now() > expirationTime;
    }
};
exports.OTP = OTP;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OTP.prototype, "otp", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], OTP.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => invitation_entity_1.Invitation, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", invitation_entity_1.Invitation)
], OTP.prototype, "invitation", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], OTP.prototype, "isActive", void 0);
exports.OTP = OTP = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['otp', 'user'])
], OTP);
//# sourceMappingURL=otp.entity.js.map