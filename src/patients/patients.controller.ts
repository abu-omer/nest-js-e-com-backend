import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  findAll(){
    return this.patientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Patient> {
    return await this.patientsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return await this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.patientsService.remove(id);
  }
  @Post('search')
  search(@Query('key') key: string):Promise<Patient[]> {
    return this.patientsService.search(key)
  }
}
