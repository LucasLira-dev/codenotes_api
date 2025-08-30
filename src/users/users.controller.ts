import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const authResponse = await this.authService.auth(user.email, createUserDto.password);
    return { user, ...authResponse };
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.auth(loginDto.email, loginDto.password);
  }

  @Get()
  async findByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

}
