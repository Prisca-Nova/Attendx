import { UserRepository } from '../repositories/user-repository.repository';
import { User } from '../entities/user.entity';
import { UUID } from 'crypto';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    getUserById(id: UUID): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    setPassword(user: User, password: string): Promise<User>;
    createUser(user: User): Promise<User>;
}
