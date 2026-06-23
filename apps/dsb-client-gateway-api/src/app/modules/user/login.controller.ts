import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AuthTokens,
  ExcludeAuthRoute,
  UserAuthService,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { ConfigResponseDto } from './dto/response/config-response.dto';
import { RefreshTokenRequestDto } from './dto/request/refresh-token-request.dto';
import { DidAuthService } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';

@Controller('login')
@ApiTags('Login')
export class LoginController {
  constructor(
    protected readonly userAuthService: UserAuthService,
    protected readonly didAuthService: DidAuthService
  ) {}

  @Get('config')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns login config',
    type: () => ConfigResponseDto,
  })
  @ExcludeAuthRoute()
  public isAuthEnabled(): ConfigResponseDto {
    return {
      authEnabled: this.userAuthService.isAuthEnabled(),
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => LoginResponseDto,
    description: 'Successfully refreshed tokens',
  })
  @ExcludeAuthRoute()
  public async refreshToken(
    @Body() body: RefreshTokenRequestDto
  ): Promise<LoginResponseDto> {
    const tokens = this.userAuthService.refreshToken(body.refreshToken);
    const decodedToken = this.userAuthService.verifyToken(tokens.accessToken);

    return {
      ...tokens,
      role: decodedToken.accountType,
      username: decodedToken.username,
    };
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully logged in',
    type: () => LoginResponseDto,
  })
  @ExcludeAuthRoute()
  public async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    const tokens: AuthTokens = await this.userAuthService.login(
      body.username,
      body.password
    );
    const decodedToken = this.userAuthService.verifyToken(tokens.accessToken);

    return {
      ...tokens,
      role: decodedToken.accountType,
      username: decodedToken.username,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout and invalidate active Auth Proxy sessions',
    description: 'Explicitly calls the Auth Proxy /auth/logout endpoint to invalidate active sessions associated with the user refresh token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully logged out and invalidated Auth Proxy sessions',
  })
  public async logout(): Promise<void> {
    await this.didAuthService.logout();
  }
}
