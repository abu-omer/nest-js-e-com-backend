import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";

@Schema({timestamps: true})
export class User {
    id:ObjectId
    @Prop({ required: true })
    name: string
    @Prop({ required: true })
    username: string
    @Prop({ required: true})
    email: string
    @Prop({ required: true })
    password: string
    @Prop({ sparse: true })
    phone: string
    @Prop()
    refreshToken: string
    @Prop({ required: true })
    age: number
    @Prop({ default: 'user'})
    roles: string[]

}
export const UserSchema = SchemaFactory.createForClass(User)


