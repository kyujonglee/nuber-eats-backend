import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User | undefined => {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    return gqlContext['user'];
  },
);
