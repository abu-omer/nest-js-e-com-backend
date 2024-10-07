import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>){}
  async create(createUserDto: CreateUserDto) {
    try {
      const userExist = await this.findUserByUsername(createUserDto.username)
      if (userExist) {
        throw new ConflictException('username is already in Use')
      }
      const emailExist = await this.findUserByEmail(createUserDto.email)
      if (emailExist) {
        throw new ConflictException('email is already in Use')
      }
      if (createUserDto.phone) {
        const phoneExist = await this.findUserByPhone(createUserDto.phone)
        if(phoneExist){
          throw new ConflictException('email is already in Use')
        }
      }
      
      const hashPassword = await bcrypt.hash(createUserDto.password, 10)
      const user = await this.userModel.create({ ...createUserDto, password: hashPassword })
      return {message: 'user successfully created',user}
    } catch (error) {
      throw new InternalServerErrorException('An error occurred');
    }
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findUserByEmail(email:string) {
    try {
      const user = await this.userModel.findOne({email:email})
      return user
    } catch (error) {
      throw new InternalServerErrorException('An error occurred');
    }
  }
  async findUserByPhone(phone:string) {
    try {
      const user = await this.userModel.findOne({phone:phone})
      return user
    } catch (error) {
      throw new InternalServerErrorException('An error occurred');
    }
  }
  async findUserById(id:string) {
    try {
      const user = await this.userModel.findOne({id:id})
      return user
    } catch (error) {
      throw new InternalServerErrorException('An error occurred');
    }
  }
  async findUserByUsername(username:string) {
    try {
      const user = await this.userModel.findOne({username:username})
      return user
    } catch (error) {
      throw new InternalServerErrorException('An error occurred');
    }
  }


  async findOne(id: string) :Promise<User>{
    return await this.userModel.findById(id);
  }

 async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(id,updateUserDto)
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
