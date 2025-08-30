import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    
    private jwtExpirationTimeInSeconds: number;
    constructor(private readonly userService: UsersService,
     private readonly refreshTokenService: RefreshTokenService,
     private readonly jwtService: JwtService, private readonly configService: ConfigService) {
     this.jwtExpirationTimeInSeconds = +(this.configService.get<number>('JWT_EXPIRATION_TIME') ?? 3600)
}

   async auth(email: string , password: string): Promise<AuthResponseDto> {
        const foundUser = await this.userService.findByEmail(email)

       if(!foundUser || !bcrypt.compareSync(password, foundUser
.password)){
            throw new UnauthorizedException();
        }

        const payload = { sub: foundUser.id, email: foundUser.email }

        const token = this.jwtService.sign(payload)

        // Gere o refresh token e data de expiração (ex: 7 dias)
        const refreshToken = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        // Salve o refresh token na tabela
        await this.refreshTokenService.create(foundUser, refreshToken, expiresAt);

        return { token, expiresIn: this.jwtExpirationTimeInSeconds, userId: foundUser.id, refreshToken }
    }

    async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
        const storedToken = await this.refreshTokenService.findByToken(refreshToken);
        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new UnauthorizedException('Refresh token inválido ou expirado');
        }
        const user = storedToken.user;
        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);

        // Gere novo refresh token e atualize na tabela
        const newRefreshToken = randomBytes(32).toString('hex');
        const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.refreshTokenService.create(user, newRefreshToken, newExpiresAt);
        await this.refreshTokenService.remove(refreshToken);

        return {
            token,
            expiresIn: this.jwtExpirationTimeInSeconds,
            userId: user.id,
            refreshToken: newRefreshToken
        };
}

}

