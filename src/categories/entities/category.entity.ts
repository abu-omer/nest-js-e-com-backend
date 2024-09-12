// src/schemas/category.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId, Types } from 'mongoose';
// import { Product } from 'src/products/entities/product.entity';
// import { User } from './user.schema';

@Schema({ timestamps: true })
export class Category extends Document {
  _id: ObjectId
  @Prop({ required: true })
  name: string;
  @Prop()
  image: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  products: Types.ObjectId[];

//   @Prop({ type: [{ type: Schema.Types.ObjectId, ref: 'User' }] })
//   users: User[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
