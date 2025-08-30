import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { RefreshToken } from 'src/refresh-token/entities/RefreshToken.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([RefreshToken]),
        forwardRef(() => UsersModule),
        JwtModule.registerAsync({
        global: true,
        imports: [],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: +(configService.get<number>('JWT_EXPIRATION_TIME') ?? 3600) }
        }),
        inject: [ConfigService]
    })],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService],
  exports: [AuthService, RefreshTokenService],
})
export class AuthModule {}
