import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";



@Module({
  imports: [
      UsersModule,
      JwtModule.register({
        global: true,
          secret: 'adhagsidgaiuwgqiugequweuqw9eg219usadbg9usgd7',
          signOptions: {
              expiresIn: '7d'
          }
      })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
