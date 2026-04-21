import { Module } from '@nestjs/common';
//import { AuthModule } from './auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { AuthModule } from './modules/Auth/auth.module';
import { PostgresProvider } from './common/providers/database.provider';
import { UserModule } from './modules/user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    AuthModule,
    TaskModule,
    UserModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [PostgresProvider],
  exports: [PostgresProvider],
})
export class AppModule {}