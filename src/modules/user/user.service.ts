import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserConfigService } from '../user-config/user-config.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly userConfigService: UserConfigService,
  ) {}

  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { auth0_id: auth0Id } });
  }

  async create(auth0Id: string): Promise<User> {
    const user = this.usersRepository.create({ auth0_id: auth0Id });
    await this.userConfigService.createDefaultConfigForUser(user.id);
    return this.usersRepository.save(user);
  }
}
