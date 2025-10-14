import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import * as dotenv from 'dotenv';
import { UsersService } from '../user/users.service'; // adjust path if needed
import { User } from '../user/user.entity'; // adjust path if needed

dotenv.config();

interface JwtPayload {
  sub: string;
  // add other claims you expect, e.g. email, roles, etc.
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    const options: StrategyOptions = {
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `${process.env.AUTH0_ISSUER_URL}`,
      algorithms: ['RS256'],
    };
    super(options);
  }

  async validate(payload: JwtPayload): Promise<User> {
    const auth0Id = payload.sub;
    let user = await this.usersService.findByAuth0Id(auth0Id);
    if (!user) {
      user = await this.usersService.create(auth0Id);
    }
    return user;
  }
}
