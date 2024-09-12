import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) { }
  
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryModel.create(createCategoryDto)
      return category
    } catch (error) {
      return error.message
    }
  }

  async findAll() {
    return await this.categoryModel.find();
  }
    async findOneByName(name: string) {
      return this.categoryModel.findOne({name})
    }

  findOne(id: string) {
    return `This action returns a #${id} category`;
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: string) {
    return `This action removes a #${id} category`;
  }
}
