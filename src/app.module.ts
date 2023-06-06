import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { SpecialitiesModule } from './specialities/specialities.module';
import { LocationsModule } from './locations/locations.module';
import { GroupsModule } from './groups/groups.module';
import { RotationsModule } from './rotations/rotations.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [UsersModule, AuthModule, MailModule, SpecialitiesModule, LocationsModule, GroupsModule, RotationsModule, EvaluationsModule, QuestionsModule],
  providers: [AppService],
})
export class AppModule { }
