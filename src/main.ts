import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';




async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
  });
  const port = process.env.PORT
  app.setGlobalPrefix('api/v1')
  app.useGlobalPipes(new ValidationPipe());
  app.use('/uploads', express.static('uploads'));
  app.use(cookieParser());

  await app.listen(port);
}
bootstrap();
