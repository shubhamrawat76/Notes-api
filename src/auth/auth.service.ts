import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
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
         
     const payload ={sub:newUser.id,email:newUser.email};
          return{
            access_token:this.jwtService.sign(payload),
          };



    }
}
