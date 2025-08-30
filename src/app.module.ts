import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NoteModule } from './note/note.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, ConfigModule.forRoot({
    isGlobal: true,
  }), NoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
