import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto, loginDto, RegisterUserDto, UpdateAuthDto } from './dto';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginResponse } from './interfaces/login-response.interface';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/login')
  login(@Body() loginDto: loginDto) {
    return this.authService.login( loginDto );
  }

  @Post('/register')
  register(@Body() registeUserDto: RegisterUserDto) {
    return this.authService.register( registeUserDto );
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll( @Request() req: Request ) {
    // console.log({req});
    //const user = req['user'];

    //return user;
    return this.authService.findAll();
  }

  //LoginResponse
  @UseGuards(AuthGuard)
  @Get('/check-token')
  checkToken(@Request() req: Request): LoginResponse {
    const user = req['user'] as User;
    return {
      user,
      token: this.authService.getJwtToken({ id: user._id })
    };
  }

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  } */
}
