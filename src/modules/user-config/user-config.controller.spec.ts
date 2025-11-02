
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UserConfigController } from './user-config.controller';
import { UserConfigService } from './user-config.service';

describe('UserConfigController', () => {
  let controller: UserConfigController;

  const userConfigServiceMock = {
    findConfigById: jest.fn(),
    createDefaultConfigForUser: jest.fn(),
    saveConfig: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserConfigController],
      providers: [
        {
          provide: UserConfigService,
          useValue: userConfigServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserConfigController>(UserConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
