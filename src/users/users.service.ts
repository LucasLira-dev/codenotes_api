import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {

  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
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
}
