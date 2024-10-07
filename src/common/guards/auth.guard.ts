import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)
    console.log('tooookn',token)
    if (!token) {
      throw new UnauthorizedException('token not found')
    }
    try {
      const decoded = this.jwtService.verifyAsync(token,  { secret: jwtConstants.secret });
      // request['user'] = decoded;
      console.log('decoded',decoded)
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  private extractTokenFromHeader(request: Request): string | null{
    const authHeader = request.headers.authorization
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  
  }
}
