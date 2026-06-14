import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
    constructor(private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async register(registerDto:RegisterDto ){
        //register logic here
        /**
         * 1 check if email already exists
         * 2 hash the password
         * 3 create the user in the datbase
         * 4  Genrate JWT token
         * 5 return the token
         */
       const user =  await this.userService.getUserByEmail(registerDto.email);
         if(user){
            throw new ConflictException('Email already exists');
         }
         const saltRounds=10;
       const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
    
     const newUser =await this.userService.crearedUser({...registerDto,password:hashedPassword});
          this.logger.log(`User created with email: ${newUser.email} and id: ${newUser.id}`);
     const payload ={sub:newUser.id,email:newUser.email};
          return{
            access_token:this.jwtService.sign(payload),
          };



    }

    async login(loginDto: LoginDto) {
/**
 * 1- Get the user by email form data base
 * 2- match the password with hashedpassword
 * 3- create jwt token
 * 4-return the  jwt token
 */
      
      const user = await this.userService.getUserByEmail(loginDto.email);
      if(!user){
        throw new UnauthorizedException('Invalid credentials');
      }
       const isMatch = await bcrypt.compare(loginDto.password,user.password);
       if(!isMatch){
        throw new UnauthorizedException('Invalid credentials');
       }

        const payload ={sub:user.id,email:user.email};
          return{
            access_token:this.jwtService.sign(payload),
          };

    }

  }
