import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma.sevice';

@Injectable()
export class UserService {
 constructor(private readonly prismaService:PrismaService){}
     async getUserByEmail(email: string) {
        //logic database for checking the email
      return   await this.prismaService.user.findFirst({where:{email}});

        
    }

    async crearedUser(registerDto:RegisterDto){
        return await this.prismaService.user.create({data:registerDto});
    }
}
