import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserRepository } from './repositories/user-repository.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [UserService, UserRepository, JwtModule],
  exports: [UserService, UserRepository],
})
export class UserModule {}
