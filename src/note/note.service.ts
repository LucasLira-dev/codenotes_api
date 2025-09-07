import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NoteService {

  constructor(
      @InjectRepository(Note)
      private readonly noteRepository: Repository<Note>
    ) { }
  

  async create(id: number, createNoteDto: CreateNoteDto) {
    // Crie o objeto User apenas com o id
    const user = new User();
    user.id = id;

    const note = this.noteRepository.create({
      ...createNoteDto,
      user: user, // Associa o objeto User à nota
    });
    return await this.noteRepository.save(note);
  }

  async findAllByUser(userId: number) {
    return await this.noteRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' } // Ordena por data de criação decrescente
    })
  }

  findOne(id: number) {
    return this.noteRepository.findOne({ where: { id }})
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    await this.noteRepository.update(id, updateNoteDto)
    return await this.noteRepository.findOne({ where: { id }})
  }

  async remove(id: number) {
    const note = await this.noteRepository.findOne({ where: { id } });
    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }
    return await this.noteRepository.remove(note);
  }
}
