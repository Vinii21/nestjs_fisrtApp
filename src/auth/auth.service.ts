import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { loginDto } from './dto/login.dto';

import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/payload.interface';
import { LoginResponse } from './interfaces/login-response.interface';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jstService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    //console.log(createAuthDto)
    try {
      const {password, ...userData} = createUserDto;
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 12),
        ...userData
      });

      await newUser.save();
      const {password:_, ...user} = newUser.toJSON();
      console.log('se creo el usuario', user)
      return user;
      //1- Encriptar contraseña | línea 30
      //2- Guardar usuario | línea 33
      //3- Generar JWT  | línea 77
      
    } catch (error) {
      console.log(error)
    }
  }

  async login(loginDto: loginDto) {
    /*debe retornar user {_id, name, email, password} y toke de acceso */
    const {email, password} = loginDto;
      const user = await this.userModel.findOne({email});
      if(!user) {
        throw new UnauthorizedException('Not valid credentials - email- se muestra esto')
      }
      if(!bcryptjs.compareSync(password, user.password)) {
        throw new UnauthorizedException('Not valid credentials - password')
      }

      const {password:_, ...rest} = user.toJSON();
      return {
        user: {...rest},
        token: this.getJwtToken({ id: user.id }),
      }

  }

  async register(registerUserDto: RegisterUserDto ): Promise<LoginResponse> {

    const user = await this.create(registerUserDto);

    return {
      user: user,
      token: this.getJwtToken({id: user._id})
    }
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById( id: string ) {
    const user = await this.userModel.findById(id);
    const {password, ...rest} = user.toJSON();
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jstService.sign(payload);
    return token;
  }
}
