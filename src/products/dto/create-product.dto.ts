import { Prop } from "@nestjs/mongoose";

export class CreateProductDto {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: number;

  @Prop()
  image: string;

  @Prop({ required: true })
  price: number;
  
  @Prop({ required: true })
  categories : string;
  

}