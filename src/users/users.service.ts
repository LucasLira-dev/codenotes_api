import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { compareSync, hashSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }


  async create(createUserDto: CreateUserDto) {
    const existingEmail = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingEmail) {
      throw new BadRequestException('Email já está em uso');
    }

    const dbUser = new User();
    dbUser.email = createUserDto.email;
    dbUser.password = hashSync(createUserDto.password, 10); //criptografa a senha

    await this.userRepository.save(dbUser);

    const { email, id } = dbUser;

    return { email, id };
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateEmail(userId: number, newEmail: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const existingEmail = await this.userRepository.findOne({ where: { email: newEmail } });
    if (existingEmail) {
      throw new BadRequestException('Email já está em uso');
    }

    user.email = newEmail;
    await this.userRepository.update(userId, { email: newEmail });

    const payload = { sub: user.id, email: newEmail };
    const token = this.jwtService.sign(payload);

    return { message: 'Email atualizado com sucesso', email: newEmail, token };
  }

    async updatePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Verifica se a senha atual está correta
    if (!compareSync(currentPassword, user.password)) {
      throw new BadRequestException('Senha atual incorreta');
    }

    user.password = hashSync(newPassword, 10);
    await this.userRepository.update(userId, { password: user.password });

    return { message: 'Senha atualizada com sucesso' };
  }

  async remove(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    await this.userRepository.delete(userId);
    return { message: 'Usuário removido com sucesso' };
  }
}
