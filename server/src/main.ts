import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import {AppInterceptor} from "./app.interceptor";
import {AllExceptionsFilter} from "./filters/all-exceptions.filter";
import {DatabaseExceptionFilter} from "./filters/database-exception.filter";
import {ConflictExceptionFilter} from "./filters/conflict-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors: true});
  const configService = app.get(ConfigService);
  //@ts-ignore
  const port = configService.get<number>('PORT') || '3001';
  app.useGlobalInterceptors(new AppInterceptor());
  app.useGlobalFilters(new DatabaseExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new ConflictExceptionFilter());
  await app.listen(port);
}
bootstrap();
