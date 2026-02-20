import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {User} from "../users/entity/user.entity";


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,private jwtService: JwtService) {
    }

    async signIn(phone: any, password: any) {

        const user = await this.usersService.findOneByPhone(phone).catch(e=>{return  new UnauthorizedException('用户不存在')})
        if (user instanceof User && await bcrypt.compare( password,user.passwordHash)) {
            const payload = {phone,role:user.role};
            
            return {token: await this.jwtService.signAsync(payload)}
        }
        else {
            throw new UnauthorizedException('密码错误');
        }
    }

    //刷新token
    async refresh(token : string,payload:any) {
        const user = await this.usersService.findOneByPhone(payload.phone);
        if(!user){
            throw new UnauthorizedException('用户不存在');
        }
        const newToken = await this.jwtService.signAsync({phone: user.phone, role: user.role});
        return {token: newToken};
    }
}
