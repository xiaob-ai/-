import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        // 处理数据库错误
        let message = 'Database operation failed';
        let status = 500;

        if (exception.message.includes('duplicate key')) {
            message = 'Record already exists';
            status = 409;
        } else if (exception.message.includes('foreign key')) {
            message = 'Related record not found';
            status = 400;
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
            error: 'Database Error',
        });
    }
}