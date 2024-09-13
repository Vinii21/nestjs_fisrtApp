import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from 'src/auth/interfaces/payload.interface';
import { AuthService } from '../../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtSerice: JwtService,
    private authService: AuthService
  ) {}

  async canActivate( context: ExecutionContext ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    //console.log({request});
    const token = this.extractTokenFromHeader(request);
    //console.log({token});

    if(!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtSerice.verifyAsync<JwtPayload>(
        token,
        {
          secret: process.env.JWT_SEED,
        }
      );
  
      const user = await this.authService.findUserById(payload.id);
      if(!user) throw new UnauthorizedException('User does not exists');
      if(!user.isActive) throw new UnauthorizedException('User is not active');
      
      //console.log({payload});
      
      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }
    

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // authorization es algo que debe venir en los headers, sin embargo es opcional, por esolo lo colocamos de esa manera
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
