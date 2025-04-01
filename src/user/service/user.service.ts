import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository.repository';
import { User, UserStatus} from '../entities/user.entity';
import { InviteUserDto } from 'src/auth/dto/auth.dto';
import { UUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getUserById(id: UUID) {
    return this.userRepository.getById(id);
  }
  async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
  async setPassword(user: User, password: string): Promise<User> {
    const saltOrRounds = 8;
    const hash = await bcrypt.hash(password, saltOrRounds);
    user.password = hash.toString();
    user.status = UserStatus.ACTIVE;
    return await this.userRepository.save(user);
  }
  async createUser(user: User): Promise<User> {
    user.status = UserStatus.PENDING_VERIFICATION;

    return await this.userRepository.save(user);
  }
}
