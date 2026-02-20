import {
    Body,
    Controller,
    Post,
    Request,
    HttpCode,
    HttpStatus, Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {Public} from "./decorators/public.decorator";
import {JwtPayload} from "./decorators/jwtPayload.decorator";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.phone, signInDto.password);
    }

    @Post('logout')
    async logout() {
        return
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Request() req,@JwtPayload() payload) {
        const token:string = req.headers.authorization
        return this.authService.refresh(token,payload);
    }
}