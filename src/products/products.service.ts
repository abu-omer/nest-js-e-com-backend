import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model, Types } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productsModle: Model<Product>, private readonly categoryservice: CategoriesService){}
  async create(createProductDto: CreateProductDto, imageFilename: string) {
    try {

      const categoryNames = Array.isArray(createProductDto.categories)
      ? createProductDto.categories
        : [createProductDto.categories];
      
      console.log(categoryNames)
      
      const categories = await Promise.all(
        categoryNames.map(async(name: string)=>{
          const category = await this.categoryservice.findOneByName(name)
          console.log(category)
      if (!category) {
        throw new NotFoundException('category does not exist')
          }
          return category
        })
      )

      const categoryIds = categories.map((category) => category._id);

      const product = await this.productsModle.create({ ...createProductDto, image: imageFilename, categories: categoryIds })
      
      await Promise.all(
        categories.map(async (category) => {
          category.products.push(product._id as any as Types.ObjectId)
      await category.save()
        })
      )
      
      return product
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll() {
    return await this.productsModle.find().populate({
        path: 'categories',
        select: 'name', // Specify the fields you want to include
      }) .exec();;
  }

  async findProductsByCategory(categoryName: string) {
    try {
      const category = await this.categoryservice.findOneByName(categoryName)
      
      if (!category) {
        throw new NotFoundException('category not found')
      }

      const products = await this.productsModle.find({ categories: category._id }).populate('categories', 'name').exec()
      return products
    } catch (error) {
      throw new Error(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async deleteProduct(id: string) {
    return this.productsModle.findByIdAndDelete(id)
  }
 async updateProductImage(productId: string, filename: string): Promise<Product> {
    let product = await this.productsModle.findByIdAndUpdate(
    productId,
    { image: filename }, // Correct way to set the image field
    { new: true } // Return the updated document
  );;
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product
  }
}
