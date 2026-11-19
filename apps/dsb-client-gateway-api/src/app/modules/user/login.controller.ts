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
import { CommandBus } from '@nestjs/cqrs';
import { ReloginCommand } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import {
  Events,
  EventsService,
} from '@dsb-client-gateway/ddhub-client-gateway-events';
import { ResponseErrorDto } from '../utils/dto/response-error.dto';
import { SwaggerTags } from '../../../swagger/swagger.constants';

@Controller('login')
@ApiTags(SwaggerTags.LOGIN)
export class LoginController {
  constructor(
    protected readonly userAuthService: UserAuthService,
    protected readonly didAuthService: DidAuthService,
    protected readonly eventsService: EventsService,
    protected readonly commandBus: CommandBus
  ) { }

  @Get('config')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get the login configuration',
    description: [
      'Tells whether user login is enabled.',
      '',
      '**Returns**',
      '- `authEnabled`: set with `USER_AUTH_ENABLED` (default `false`).',
      '',
      '**Notes**',
      '- `true`: protected endpoints need a login token or an API key.',
      '- `false`: no credentials are needed, and login is not available.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current login configuration.',
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
  @ApiOperation({
    summary: 'Exchange a refresh token for a new token pair',
    description: [
      'Gets new tokens without sending the password again.',
      '',
      '**Send**',
      '- `refreshToken`: from an earlier login or refresh.',
      '',
      '**Returns**',
      '- A new access token (valid 1 hour) and refresh token (valid 20 hours).',
      '',
      '**Notes**',
      '- Call it before the access token expires.',
      '- Only when `USER_AUTH_ENABLED=true`.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => LoginResponseDto,
    description: 'New access and refresh tokens, plus the role and username they were issued for.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: () => ResponseErrorDto,
    description:
      'Returned with `err.code` `DHCG::UNKNOWN` when the token cannot be refreshed. `err.reason` tells which case applies:\n' +
      '- `Auth not enabled`: `USER_AUTH_ENABLED` is not `true`.\n' +
      '- `jwt expired`, `invalid signature`, `jwt malformed` (or a similar message): the refresh token has expired, is not valid for this gateway, or is not a token.\n' +
      '- `invalid token type`: an access token was sent instead of a refresh token.\n\n' +
      'Also used for unexpected internal errors.',
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
  @ApiOperation({
    summary: 'Log in with username and password',
    description: [
      'Logs in with a username and password.',
      '',
      '**Send**',
      '- `username` and `password`.',
      '',
      '**Returns**',
      '- `accessToken` (valid 1 hour), `refreshToken` (valid 20 hours), `role` and `username`.',
      '',
      '**Notes**',
      '- Send the access token as `Authorization: Bearer <accessToken>`.',
      '- To log out, discard the tokens.',
      '- Only when `USER_AUTH_ENABLED=true`.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login succeeded. Contains the token pair, the role and the username.',
    type: () => LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: () => ResponseErrorDto,
    description:
      'Returned with `err.code` `DHCG::UNKNOWN` when login is refused. `err.reason` tells which case applies:\n' +
      '- `Auth not enabled`: `USER_AUTH_ENABLED` is not `true`.\n' +
      '- `User does not exist or password is incorrect`: unknown username or wrong password (the two cases are deliberately not distinguished).\n\n' +
      'Also used for unexpected internal errors (for example when the user accounts cannot be read).',
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
    summary: 'Reset the gateway session with the Message Broker',
    description: [
      'Logs the gateway out of the EWDS Message Broker and straight back in, to get fresh credentials.',
      '',
      '**Notes**',
      '- Does not log out a user: tokens and API keys keep working.',
      '- Use it after a role change, or to end the Message Broker sessions of the gateway.',
      '- Other instances of the same deployment do the same within about a minute.',
      '- A `200` means it was attempted; the gateway status shows whether it is connected again.',
    ].join('\n'),
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Logout and re-login attempted. Empty body.',
  })
  public async logout(): Promise<void> {
    await this.didAuthService.logout();
    await this.eventsService.triggerEvent(Events.LOGOUT);
    await this.commandBus.execute(new ReloginCommand('LOGOUT'));
  }
}
