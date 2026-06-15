import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.sevice';

@Module({
  controllers: [NoteController],
  providers: [NoteService,JwtService,PrismaService],
})
export class NoteModule {}
