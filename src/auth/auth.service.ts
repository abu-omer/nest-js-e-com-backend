import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';
import { Request, Response } from 'express';


@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService, private blacklistedTokens: Set<string> = new Set()) { }

    async signUp(signUpDto: SignUpDto) {
        try {
            const userExist = await this.usersService.findUserByUsername(signUpDto.username)
            if (userExist) {
                throw new ConflictException('user already in use')
            }
            const emailExist = await this.usersService.findUserByEmail(signUpDto.email)
             if (emailExist) {
                 throw new ConflictException('email is already in Use')
            }
            if (signUpDto.phone) {
            const phoneExist = await this.usersService.findUserByPhone(signUpDto.phone)
              if(phoneExist){
                  throw new ConflictException('email is already in Use')
        }
      }
            const hashPassword = await bcrypt.hash(signUpDto.password, 10);
            const user = await this.usersService.create({ ...signUpDto, password: hashPassword });
            return user;
        } catch (error) {
            console.error('Error during sign up:', error.message);
            throw new InternalServerErrorException('An error occurred');
        }
        
    }

    async login(loginDto: LoginDto,  res: Response) {
        try {
            const user = await this.usersService.findUserByUsername(loginDto.username)
            if (!user) {
                throw new NotFoundException('incorrect credintials')
            }
            const matchPassword = await bcrypt.compare(loginDto.password, user.password)
            if (!matchPassword) throw new NotFoundException('incorrect credintials')
            const payload = { id:user._id, username: user.username }
            const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.SECRET_KEY, expiresIn: '30s' })
            const refreshToken = await this.jwtService.signAsync({id:user._id} ,{ secret: process.env.REFRESH_TOKEN_SECRET_KEY, expiresIn: '1d' })
            await user.updateOne({ refreshToken: refreshToken })
            res.cookie('accessToken', accessToken, {
      httpOnly: true, // Important: prevents client-side JavaScript access
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'strict', // CSRF protection
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // Set the refresh token in the cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
            return {accessToken,refreshToken, roles: user.roles}
            
        } catch (error) {
            throw new InternalServerErrorException('Failed to log in');
        }
    }

    async logout(token: string): Promise<{ message: string }> {
    this.blacklistedTokens.add(token); // Add token to blacklist
    return { message: 'Logged out successfully' };
  }

  // Check if a token is blacklisted
  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
    

    // async refresh() {
        
    // }
    
}
