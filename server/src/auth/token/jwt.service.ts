import * as jwt from 'jsonwebtoken'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JwtService {
  private INVALID_SIGNATURE_ERROR = 'invalid signature'

  verify(
    token: string,
    secrets: string[],
    options?: jwt.VerifyOptions
  ): string | object {
    for (let count = 0; count < secrets.length; count++) {
      try {
        return jwt.verify(token, secrets[count], options)
      } catch (error) {
        // ignore invalid signature of token and continue with next secret
        // any other error will be thrown
        if (error.message !== this.INVALID_SIGNATURE_ERROR) {
          throw error
        }
      }
    }

    throw new jwt.JsonWebTokenError(this.INVALID_SIGNATURE_ERROR)
  }
}
