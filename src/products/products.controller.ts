import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/common/core/auth-guard/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }
  
   @Post('create')
  @UseInterceptors(FileInterceptor('image',{
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async create(@Body() createProductDto: CreateProductDto, @UploadedFile() image: Express.Multer.File) {
  console.log('Received image:', image);

  if (!image) {
    throw new BadRequestException('Image file is required');
  }

  console.log('Filename:', image.filename);
     const product = await this.productsService.create(createProductDto, image.filename);
      return product
      
  }

  // @Post()
  // async create(@Body() createProductDto: CreateProductDto) {
  //   return await this.productsService.create(createProductDto);
  // }

  @Get('all')
  @UseGuards(AuthGuard)
  async findAll() {
    const products = await this.productsService.findAll();
    return products.map(product => ({
      ...product.toObject(),
      image: `http://localhost:3000/uploads/${product.image}`,
    }));
  }

  @Get('category/:categoryName')
  async getProductsByCategory(@Param('categoryName') categoryName: string) {
    const products = await this.productsService.findProductsByCategory(categoryName)
    return products.map(product => ({
      ...product.toObject(),
      image: `http://localhost:3000/uploads/${product.image}`,
    }));
    }
      

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete('delete/:id')
async deleteProduct(@Param('id') id: string) {
  return await this.productsService.deleteProduct(id);
}
 
}

