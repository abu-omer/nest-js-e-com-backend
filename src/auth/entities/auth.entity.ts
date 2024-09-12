import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: true})
export class Auth {

    @Prop({ required: true, unique: true })
    username: string
    @Prop({ required: true,unique: true })
    password: string
   

}
export const AuthSchema = SchemaFactory.createForClass(Auth)


