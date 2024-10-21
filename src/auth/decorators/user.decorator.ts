import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If data is not provided, return the whole user object
    if (!data) return user;

    // If data is provided, return the specified field
    return user?.[data];
  },
);
