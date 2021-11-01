/*
 * Requires that the user is logged in to use a query, mutation or subscription
 * To use it, import this AuthGuard and UseGuards
 * import { UseGuards } from '@nestjs/common';
 * import { AuthGuard } from 'src/auth.guard';
 * Then a use it add the decorator above your querie, mutation or subscription
 * @UseGuards(AuthGuard)
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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

    if (!authHeader) {
      //   throw new AuthenticationException('Authorization header not found.')
      // }

      const [type, token] = authHeader.split(' ')

      if (type !== 'Bearer') {
        // throw new AuthenticationException(
        //   `Authentication type 'Bearer' required. Found '${type}'`
        // )
      }

      try {
        gqlContext.token = token
        gqlContext.user = this.auth.validateToken(token)

        return true
      } catch (error) {
        // throw new AuthenticationException(error)
      }
    }
  }
}
