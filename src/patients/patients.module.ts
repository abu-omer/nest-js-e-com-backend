import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './entities/patient.entity';

@Module({
  imports:[MongooseModule.forFeature([{name:Patient.name, schema:PatientSchema}])],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
