import { Prop } from "@nestjs/mongoose"
import { trusted } from "mongoose"

export class LoginDto {

    @Prop({ required: true })
    username: string
    @Prop({ required: true })
    password: string
   

}