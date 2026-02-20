import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtPayload = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return data ? request.user[data] : request.user; // 返回整个对象或某个字段
    },
);