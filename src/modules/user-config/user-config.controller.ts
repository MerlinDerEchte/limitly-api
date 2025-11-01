import { Get, Controller, Request, Post, Body } from '@nestjs/common';
import { UserConfigService } from './user-config.service';
import type { UserConfigDTO } from './types/userConfig.dto';
import { type AuthRequest } from '@/modules/authz/types/auth-request';
import {
  mapUserConfigDTOToUserConfig,
  mapUserConfigToUserConfigDTO,
} from './utils/user-config.util';
@Controller('user-config')
export class UserConfigController {
  constructor(private readonly userConfigService: UserConfigService) {}
  @Get()
  async getUserConfig(
    @Request() req: AuthRequest,
  ): Promise<UserConfigDTO | null> {
    const user = req.user;
    return this.userConfigService.findConfigById(user.id);
  }

  @Post()
  async saveUserConfig(
    @Body() userConfigDTO: UserConfigDTO,
    @Request() req: AuthRequest,
  ): Promise<UserConfigDTO | null> {
    const user = req.user;
    const config = mapUserConfigDTOToUserConfig(userConfigDTO);
    if (config === null) {
      return null;
    }
    const savedConfig = await this.userConfigService.saveConfig({
      ...config,
      userId: user.id,
    });
    if (savedConfig === null) {
      return null;
    }
    return mapUserConfigToUserConfigDTO(savedConfig);
  }
}
