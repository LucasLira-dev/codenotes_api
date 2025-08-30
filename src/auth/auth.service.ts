import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    
    private jwtExpirationTimeInSeconds: number;
    constructor(private readonly userService: UsersService, private readonly jwtService: JwtService, private readonly configService: ConfigService) {
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

        return { token, expiresIn: this.jwtExpirationTimeInSeconds, userId: foundUser.id }
    }


}

