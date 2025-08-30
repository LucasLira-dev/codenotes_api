import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
   imports: [ TypeOrmModule.forRootAsync({
         useFactory: async (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get<string>('DB_HOST'),
              port: +(configService.get<number>('DB_PORT') ?? 5432),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_NAME'),
              entities: [__dirname + '/../**/*.entity.{ts,js}'],
              migrations: [__dirname + '/migrations/*.ts'],
              synchronize: false
         }), 
         inject: [ConfigService],
     })],



  providers: [DatabaseService]
})
export class DatabaseModule {}
