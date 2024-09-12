import { Prop } from "@nestjs/mongoose";

export class CreatePatientDto {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop()
  address: string;

  @Prop({ required: true })
  phone: string;
  
  @Prop()
  profile: string;
}