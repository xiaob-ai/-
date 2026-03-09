import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const client = context.switchToWs().getClient();
        const token = client.handshake.auth.token || client.handshake.query.token;

        try {
            const payload = this.jwtService.verify(token);
            client.user = payload;
            return true;
        } catch {
            return false;
        }
    }
}