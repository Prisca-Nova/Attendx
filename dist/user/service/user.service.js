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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_repository_1 = require("../repositories/user-repository.repository");
const user_entity_1 = require("../entities/user.entity");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getUserById(id) {
        return this.userRepository.getById(id);
    }
    async getUserByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async setPassword(user, password) {
        const saltOrRounds = 8;
        const hash = await bcrypt.hash(password, saltOrRounds);
        user.password = hash.toString();
        user.status = user_entity_1.UserStatus.ACTIVE;
        return await this.userRepository.save(user);
    }
    async createUser(user) {
        user.status = user_entity_1.UserStatus.PENDING_VERIFICATION;
        return await this.userRepository.save(user);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map