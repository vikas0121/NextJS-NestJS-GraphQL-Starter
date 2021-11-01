import { AuthModule } from '@auth/auth.module';
import { ChatModule } from '@chat/chat.module';
import { MONO_DB_CONNECTION_STRING } from '@constants';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '@user/user.module';
import { get } from 'lodash';
import { AuthMiddleware } from './auth/auth.middleware';
// import SentryPlugin from './sentry.plugin';
import { resolvers, schemas, services } from './config/providers';
import { HealthzController } from './healthz/healthz.controller';
@Module({
  imports: [
    MongooseModule.forRoot(MONO_DB_CONNECTION_STRING, {
      useCreateIndex: true,
      useNewUrlParser: true,
    }),
    MongooseModule.forFeature([...schemas]),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,

      // cors: {
      //   origin: CORS_ORIGIN,
      //   optionsSuccessStatus: 200,
      //   credentials: true,
      // },
      // plugins: [SentryPlugin],
      // engine: {
      //   // The Graph Manager API key
      //   apiKey: ENGINE_API_KEY,
      //   // A tag for this specific environment (e.g. `development` or `production`).
      //   // For more information on schema tags/variants, see
      //   // https://www.apollographql.com/docs/platform/schema-registry/#associating-metrics-with-a-variant
      //   schemaTag: ENV,
      // },
      autoSchemaFile: 'schema.gql',
      context: ({ req, res, connection }) => {
        const clientId = get(connection, 'context.clientId');
        return { req, res, ...(clientId && { clientId }) };
      },
    }),
    AuthModule,
    ChatModule,
    UserModule,
  ],
  controllers: [HealthzController],
  providers: [...services, ...resolvers],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
