import { IsNotEmpty, IsString, IsArray, IsMongoId } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  image: string;

  @IsArray()
  @IsMongoId({ each: true })
  products: string[];

//   @IsArray()
//   @IsMongoId({ each: true })
//   users: string[];
}