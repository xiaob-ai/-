import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {UsersService} from "./users.service";
import {User} from "./entity/user.entity";
import * as bcrypt from 'bcrypt';
import {Public} from "../auth/decorators/public.decorator";
import {JwtPayload} from "../auth/decorators/jwtPayload.decorator";

@Controller('users')
export class UsersController {
    constructor(private  userService: UsersService) {}
    //注册
    @Public()
    @Put('/register')
    async register(@Body() body: any) {
        //拿到注册信息
        const {phone, password,name} = body;
        const user:User = new User();
        user.phone = phone;
        user.passwordHash = await bcrypt.hash(password, 10);
        user.username = name;
        user.avatar = 'https://picsum.photos/id/237/200/300';
        const res = await this.userService.create(user);
        return res;
    }

    @Get('info')
    async getUserInfo(@JwtPayload() payload) {
        const res = await this.userService.findOneByPhone(payload.phone);
        return res;
    }
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        const res = await this.userService.findOne(id);
        return res;
    }





}
