import { Cache } from 'cache-manager';

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = await this.jwtService.verifyAsync(token);
      let user = await this.cacheManager.get(`user:${payload.sub}`);

      if (!user) {
        user = await this.userService.getUserById(payload.sub);
        await this.cacheManager.set(`user:${payload.sub}`, user, 300000);
      }

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
