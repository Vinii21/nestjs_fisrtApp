import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>
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
      return user;
      //1- Encriptar contraseña
      //2- Guardar usuario
      //3- Generar JWT
      
    } catch (error) {
      console.log(error)
    }
  }

  async login(loginDto: loginDto) {
    /*debe retornar user {_id, name, email, password} y toke de acceso */
    const {email, password} = loginDto;
      const user = await this.userModel.findOne({email});
      if(!user) {
        throw new UnauthorizedException('Not valid credentials - email')
      }
      if(!bcryptjs.compareSync(password, user.password)) {
        throw new UnauthorizedException('Not valid credentials - password')
      }

      const {password:_, ...rest} = user.toJSON();
      return {
        user: {...rest},
        token: 'ABC-123'
      }
  }

  findAll() {
    return `This action returns all auth`;
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
}
