import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { auth0_id: auth0Id } });
  }

  async create(auth0Id: string): Promise<User> {
    const user = this.usersRepository.create({ auth0_id: auth0Id });
    return this.usersRepository.save(user);
  }
}
