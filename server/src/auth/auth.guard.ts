/*
 * Requires that the user is logged in to use a query, mutation or subscription
 * To use it, import this AuthGuard and UseGuards
 * import { UseGuards } from '@nestjs/common';
 * import { AuthGuard } from 'src/auth.guard';
 * Then a use it add the decorator above your querie, mutation or subscription
 * @UseGuards(AuthGuard)
 */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
// import { AuthenticationException } from './authentication.exception'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // const ctx = GqlExecutionContext.create(context);
    // const { req } = ctx.getContext();

    // return Boolean(req.user && Object.values(Roles).includes(req.user.role));
    const gqlContext = GqlExecutionContext.create(context).getContext()
    const authHeader = gqlContext.req?.headers?.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthorizedException('Bearer Token not present');
    }

    const [type, token] = authHeader.split(' ')

    try {
      gqlContext.token = token
      gqlContext.user = this.auth.validateToken(token)

      return true
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
