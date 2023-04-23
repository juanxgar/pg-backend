import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { SpecialitiesModule } from './specialities/specialities.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [UsersModule, AuthModule, MailModule, SpecialitiesModule, LocationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
