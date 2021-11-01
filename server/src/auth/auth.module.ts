import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { resolvers, schemas, services } from '../config/providers';

@Module({
  imports: [MongooseModule.forFeature([...schemas])],
  providers: [...services, ...resolvers],
})
export class AuthModule { }
