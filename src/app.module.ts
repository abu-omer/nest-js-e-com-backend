import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv'
import { ProductsModule } from './products/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/core/auth-guard/auth.guard';
import { ConfigModule } from '@nestjs/config';
// config()


@Module({

  imports: [ConfigModule.forRoot(),MongooseModule.forRoot(process.env.MONGO_URI),ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'), // Adjust the path as necessary
    renderPath: '/uploads', // Optional, if you want to serve under a specific path
    }),PatientsModule, ProductsModule, CategoriesModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

