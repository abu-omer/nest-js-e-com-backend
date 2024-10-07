import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isArray } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) { }
  async use(req: Request, res: Response, next: NextFunction) {
    let authHeader = req.headers.authorization || req.headers.Authorization
      // console.log('authHeader', authHeader)

    if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
      req.currentUser = null
      return next()
  
    } else {
      const token = authHeader.split(' ')[1]
      const {id} = this.jwtService.verify(token,{secret: process.env.SECRET_KEY}) as jwtPayload;
      
      const currentUser = await this.usersService.findOne(id)
      req.currentUser = currentUser


      next();

    }
    }
  }


interface jwtPayload {
  id: string
}