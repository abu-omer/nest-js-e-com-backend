import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Patient } from './entities/patient.entity';
import { Model } from 'mongoose';

@Injectable()
export class PatientsService {
  constructor(@InjectModel(Patient.name) private readonly patientModle: Model<Patient>){}
  create(createPatientDto: CreatePatientDto) {
    return this.patientModle.create(createPatientDto);
  }

  findAll() {
    return this.patientModle.find();
  }

  async findOne(id: string): Promise<Patient> {
    try {
      const patient = await this.patientModle.findById(id)
      if (!patient) {
        throw new NotFoundException('no patient with the provided Id')
      }
      return patient
    } catch (error) {
      return error
    }
    
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    try {
      const patient = await this.patientModle.findByIdAndUpdate (id,updatePatientDto)
      if (!patient) {
        throw new NotFoundException('no patient found')
      }
      return patient
    } catch (error) {
      return error
    }
  }

  async remove(id: string) {
    try {
      const patient = await this.patientModle.findByIdAndDelete(id);
      if (!patient) {
        throw new NotFoundException('patient not found')
      }
      return patient
    } catch (error) {
      return error
    }
  }
  search(key: string):Promise<Patient[]> {
    const keyword = {
      $or:[
      {name:{$regex: key, $options: 'i'}},
      {phone:{$regex: key, $options: 'i'}},
    ]}
    return this.patientModle.find(keyword).exec();
  }
}
