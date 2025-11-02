
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UserConfigService } from './user-config.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserConfigEntity } from './types/userConfig.entity';

describe('UserConfigService', () => {
  let service: UserConfigService;

  const userConfigRepositoryMock = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserConfigService,
        {
          provide: getRepositoryToken(UserConfigEntity),
          useValue: userConfigRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserConfigService>(UserConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
