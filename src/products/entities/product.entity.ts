import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, ObjectId, Types } from 'mongoose';
// import { Category } from "src/categories/entities/category.entity";


@Schema()
export class Product extends Document {
    _id: ObjectId
    @Prop({ required: true })
    title: string
    @Prop({ required: true })
    description: string
    @Prop()
    image: string
    @Prop()
    price: number;
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }] })
    categories: Types.ObjectId[];
   
}

export const ProductSchema = SchemaFactory.createForClass(Product)
