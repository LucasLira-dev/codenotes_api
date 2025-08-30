import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/RefreshToken.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RefreshTokenService {
    constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>
  ) {}

  async create(user: User, token: string, expiresAt: Date): Promise<RefreshToken> {
    const refreshToken = this.refreshTokenRepository.create({ user, token, expiresAt });
    return await this.refreshTokenRepository.save(refreshToken);
  }

  async findByToken(token: string): Promise<RefreshToken | undefined> {
    const result = await this.refreshTokenRepository.findOne({ where: { token }, relations: ['user'] });
    return result === null ? undefined : result;
  }

  async remove(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }
}
