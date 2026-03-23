import{CanActivate,  ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UtilService } from '../services/util.services';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private utilSvc: UtilService) {}

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const request = context.switchToHttp().getRequest() as Request;
        const token = this.extractTokenFromHeader(request);

        if(!token)
            throw new UnauthorizedException();
        try {
const playload = await this.utilSvc.getPayload(token);
request['user'] = playload;
        }catch{
throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | null {
        const[type, token] = request.headers['authorization']?.split(' ') ?? [];
        return type === 'Bearer' ? token : null;
    }
  }