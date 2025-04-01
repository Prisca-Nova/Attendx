import { Cache } from 'cache-manager';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';
export declare class AuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly userService;
    private readonly cacheManager;
    constructor(jwtService: JwtService, userService: UserService, cacheManager: Cache);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
