import { AuthResolver } from '@auth/auth.resolver';
import { SessionSchema } from '@auth/auth.schema';
import { AuthService } from '@auth/auth.service';
import { JwtService } from '@auth/token/jwt.service';
import { ChatResolver } from '@chat/chat.resolver';
import { UserResolver } from '@user/user.resolver';
import { UserSchema } from '@user/user.schema';
import { UserService } from '@user/user.service';

export const services = [UserService, AuthService, JwtService];

export const resolvers = [UserResolver, AuthResolver, ChatResolver];

export const schemas = [
  { name: 'User', schema: UserSchema },
  { name: 'Session', schema: SessionSchema }
];
