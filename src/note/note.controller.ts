import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';

@Controller('api/notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(AuthGuard) 
  @Post()
    create(@Body() createNoteDto: CreateNoteDto, @Req() req: Request & { user: { sub: number } }) {
    return this.noteService.create(createNoteDto,req.user.sub);
  }


  @UseGuards(AuthGuard)
  @Get()
  findAll( @Req() req: Request & { user: { sub: number } },
           @Query('skip', new ParseIntPipe({ optional: true })) skip: number,
            @Query('take', new ParseIntPipe({ optional: true })) take: number) {

    return this.noteService.findAll({ skip: skip || 0, take: take || 10 }, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number,
        @Req() req: Request & { user: { sub: number } }) {
    return this.noteService.findOne(id,req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: number, 
        @Body() updateNoteDto: UpdateNoteDto,
        @Req() req: Request & { user: { sub: number } }) {
    return this.noteService.update(id, updateNoteDto, req.user.sub);
  }


  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number,@Req() req: Request & { user: { sub: number } }) {
    return this.noteService.remove(id,req.user.sub);
  }

}
