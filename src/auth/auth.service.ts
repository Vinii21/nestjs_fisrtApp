import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  create(createAuthDto: CreateUserDto): Promise<User> {
    //console.log(createAuthDto)
    try {
      const newUser = new this.userModel(createAuthDto);
      //1- Encriptar contraseña
      //2- Guardar usuario
      //3- Generar JWT
      return newUser.save();
    } catch (error) {
      console.log(error)
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
