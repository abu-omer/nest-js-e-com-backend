
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class Patient {
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

export const PatientSchema = SchemaFactory.createForClass(Patient);
