import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma.sevice';
import { Logger } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';




@Injectable()
export class NoteService {
  private logger = new Logger(NoteService.name);
  constructor(private readonly prismaService:PrismaService) {}


   async  create(createNoteDto: CreateNoteDto,userId:number) {
    /**
     * create note logic will be implemented here
     * 
     */
  const note=  await this.prismaService.note.create({
      data:{
        title:createNoteDto.title,
        content:createNoteDto.content,
        userId: userId

    }})
    this.logger.log(`Note created with title: ${createNoteDto.title} for userId: ${userId}`);
    return note;
  }

    async findAll(
       { skip, take }: { skip: number; take: number },
        userId:number) {
    const notes =  await this.prismaService.note.findMany({
      where: {
        userId: userId,
      }
    });


    return notes;
  }

   async findOne(id: number, userId:number) {
    const note = await this.prismaService.note.findFirst({
      where: {
        id: id,
      }
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    if(note?.userId !== userId){
      throw new ForbiddenException('You do not have access to this note');
    }
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId:number) {
    const note = await this.prismaService.note.findFirst({
      where: {
        id: id,
      }
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    if(note?.userId !== userId){
      throw new ForbiddenException('You do not have access to this note');
    }

    const updatedNote = await this.prismaService.note.update({
      where: {
        id: id,
      },
      data: {
        title: updateNoteDto.title,
        content: updateNoteDto.content
      }
    });
    return updatedNote;
  }

  async  remove(id: number, userId:number) {
   const note = await this.prismaService.note.findFirst({
      where: {
        id: id,
      }
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    if(note?.userId !== userId){
      throw new ForbiddenException('invalid action');
    }

    await this.prismaService.note.delete({
      where: {id: id},
    });


    return `This action removes a #${id} note`;
  }
}
