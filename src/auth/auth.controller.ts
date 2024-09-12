import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signUp.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService, private usersService: UsersService) { }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }
   @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({passthrough:true}) res: Response): Promise<{ token: string }> {
    const cookies = req.cookies;
    
    if (!cookies?.refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const refreshToken = cookies.refreshToken;
    
    try {
      const decoded = await this.jwtService.verify(refreshToken, { secret: process.env.ACCESS_TOKEN_SECRET_KEY});
      const {id, roles} = decoded
      const foundUser =  this.usersService.findOne(id); // Use decoded.sub if sub contains user ID

      if (!foundUser) {
        throw new UnauthorizedException('Unauthorized');
      }
      const token =  this.jwtService.sign({ id, roles }, { secret: process.env.ACCESS_TOKEN_SECRET_KEY, expiresIn: '30s' });
      

      return { token };

    } catch (error) {
       throw new UnauthorizedException('Unauthorized');
    }    
   
  }
@Post('logout')
  async logout(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      return this.authService.logout(token);
    } else {
      return { message: 'No token provided' };
    }
  }
  }

