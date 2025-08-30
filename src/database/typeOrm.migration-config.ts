import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Note } from 'src/note/entities/note.entity';
import { RefreshToken } from 'src/refresh-token/entities/RefreshToken.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: +(configService.get<number>('DB_PORT') ?? 5432),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [User, Note, RefreshToken],
    migrations: [__dirname + '/migrations/*.ts'],
    synchronize: false

}


export default new DataSource(dataSourceOptions)
