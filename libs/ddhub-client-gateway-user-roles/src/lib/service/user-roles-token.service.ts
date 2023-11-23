import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { UserRole } from '../const';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserTokenData {
  type: 'refresh' | 'access';
  accountType: UserRole;
  username: string;
}

@Injectable()
export class UserRolesTokenService {
  constructor(protected readonly configService: ConfigService) {}

  public verifyToken(accessToken: string): UserTokenData {
    const decoded: any = jwt.verify(
      accessToken,
      this.configService.get('JWT_USER_PRIVATE_KEY'),
    );

    if (decoded.type !== 'access') {
      throw new Error('Invalid token');
    }

    return decoded;
  }

  public refreshToken(refreshToken: string): AuthTokens {
    const decryptedToken: any = jwt.verify(
      refreshToken,
      this.configService.get('JWT_USER_PRIVATE_KEY'),
    );

    if (decryptedToken.type !== 'refresh') {
      throw new Error('invalid token type');
    }

    return this.generateTokens(
      decryptedToken.username,
      decryptedToken.accountType,
    );
  }

  public generateTokens(username: string, accountType: UserRole): AuthTokens {
    return {
      accessToken: jwt.sign(
        {
          username,
          accountType,
          type: 'access',
        },
        this.configService.get('JWT_USER_PRIVATE_KEY'),
        {
          expiresIn: 3600,
        },
      ),
      refreshToken: jwt.sign(
        {
          username,
          accountType,
          type: 'refresh',
        },
        this.configService.get('JWT_USER_PRIVATE_KEY'),
        {
          expiresIn: 72000,
        },
      ),
    };
  }
}
