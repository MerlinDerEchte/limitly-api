import type { Request } from 'express';
import type { User } from '../../../modules/user/user.entity';

export interface AuthRequest extends Request {
  user: User;
}
