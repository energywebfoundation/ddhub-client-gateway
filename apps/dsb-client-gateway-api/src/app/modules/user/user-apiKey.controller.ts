import { Roles, UserGuard, Username, UserRole } from "@dsb-client-gateway/ddhub-client-gateway-user-roles";
import { SecretsEngineService } from "@dsb-client-gateway/dsb-client-gateway-secrets-engine";
import { BadRequestException, Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiKeyResponseDto } from "./dto/response/apikey-response.dto";
import { UserDetailsDto } from "./dto/response/user-response.dto";
import { ResponseErrorDto } from "../utils/dto/response-error.dto";
import { SwaggerTags } from "../../../swagger/swagger.constants";

// Shared Swagger texts. The request bodies of this controller have no DTO
// class and no class-validator rules, so the inline schemas below are the
// only description of them.
const ROLE_VALUES_DESCRIPTION =
  [
  '- `admin`: all endpoints.',
  '- `superadmin`: same as `admin`.',
  '- `messaging`: messaging and read-only lookups only.',
].join('\n');

// Roles a user account can be created with. superadmin accounts are only
// provisioned outside the API.
const CREATABLE_USER_ROLES: readonly string[] = [UserRole.ADMIN, UserRole.MESSAGING];

const API_KEY_PARAM_DESCRIPTION =
  'The API key (48 lowercase letters and digits). It ends up in URLs and logs.';

const API_KEY_PARAM_EXAMPLE = 'k3v9x0q2m7w1z8r4t6y5u0i9o8p7a6s5d4f3g2h1j0klzx9c';

@Controller('user-api-key')
@ApiTags(SwaggerTags.USER_API_KEY)
@UseGuards(UserGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
export class UserApiKeyController {
  constructor(private readonly secretsEngineService: SecretsEngineService) { }

  // ---------- Current User ----------
  @Get('users/me')
  @UseGuards(UserGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiOperation({
    summary: 'Get the account of the logged in user',
    description: [
      'Gets the account of the logged-in user.',
      '',
      '**Returns**',
      '- `username`, `password` and `role`. Treat it as sensitive.',
      '- Empty body with an API key, or when login is disabled.',
    ].join('\n'),
  })
  @ApiResponse({
    status: 200,
    type: UserDetailsDto,
    description:
      'The current user account. Empty body when no account matches the caller (API key authentication, or authentication disabled).',
  })
  async getCurrentUser(@Username() username: string): Promise<UserDetailsDto> {
    return this.secretsEngineService.getUserAuthDetails(username);
  }

  // ---------- Users ----------
  @Post('users')
  @ApiOperation({
    summary: 'Create a user account',
    description: [
      'Creates a user account.',
      '',
      '**Send**',
      '- `username`: 4 to 64 characters, not taken yet.',
      '- `password`: 4 to 128 characters.',
      '- `role`: `admin` or `messaging`.',
      '',
      '**Notes**',
      '- The account can log in straight away.',
      '- The role cannot be changed later.',
      '- Other gateway instances that share the accounts see it after they restart.',
    ].join('\n'),
  })
  @ApiBody({
    description: 'The account to create.',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'Login name of the new account. Must not exist yet. Avoid `/` and spaces.',
          example: 'operator01',
        },
        password: {
          type: 'string',
          format: 'password',
          description: 'Password of the new account (4 to 128 characters).',
          example: 'change-me-please',
        },
        role: {
          type: 'string',
          enum: [...CREATABLE_USER_ROLES],
          description: 'Role of the new account: `admin` or `messaging`. Any other value, including `superadmin`, is rejected.\n' + ROLE_VALUES_DESCRIPTION,
          example: UserRole.MESSAGING,
        },
      },
      required: ['username', 'password', 'role'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Account created. Empty body.',
  })
  @ApiResponse({
    status: 500,
    type: ResponseErrorDto,
    description:
      'Returned with `err.code` `DHCG::UNKNOWN`. `err.reason` tells which case applies:\n' +
      '- `Creating SUPERADMIN users is not allowed`: `role` was `superadmin`.\n' +
      '- `Invalid role "<role>"`: `role` is missing or is not `admin` or `messaging`.\n' +
      '- `User already exists`: an account with this `username` already exists.\n\n' +
      'Also used for storage failures and unexpected internal errors.',
  })
  async setUserPassword(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('role') role: UserRole,
  ): Promise<void> {
    if (role === UserRole.SUPERADMIN) {
      throw new BadRequestException('Creating SUPERADMIN users is not allowed');
    }

    if (!CREATABLE_USER_ROLES.includes(role)) {
      throw new BadRequestException(`Invalid role "${role}"`);
    }

    const exists = await this.secretsEngineService.userExists(username);
    if (exists) {
      throw new ConflictException('User already exists');
    }

    await this.secretsEngineService.setUserPassword(username, password, role);
  }

  @Put('users')
  @ApiOperation({
    summary: 'Change the password of a user account',
    description: [
      'Changes the password of a user account.',
      '',
      '**Send**',
      '- `username`, and the new `password` (4 to 128 characters).',
      '',
      '**Notes**',
      '- The role does not change.',
    ].join('\n'),
  })
  @ApiBody({
    description: 'The account and its new password.',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'Username of the existing account.',
          example: 'operator01',
        },
        password: {
          type: 'string',
          format: 'password',
          description: 'New password (4 to 128 characters).',
          example: 'a-new-password',
        },
      },
      required: ['username', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed. Empty body.',
  })
  @ApiResponse({
    status: 404,
    type: ResponseErrorDto,
    description: 'No account exists with this `username` (`err.code` `DHCG::ROUTE_NOT_FOUND`, `err.reason` `User does not exist`).',
  })
  async updateUserPassword(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<void> {
    const exists = await this.secretsEngineService.userExists(username);

    if (!exists) {
      throw new NotFoundException('User does not exist');
    }

    const user = await this.secretsEngineService.getUserAuthDetails(username);
    await this.secretsEngineService.setUserPassword(user.username, password, user.role as UserRole);
  }

  @Delete('users/:username')
  @ApiOperation({
    summary: 'Delete a user account',
    description: [
      'Deletes a user account.',
      '',
      '**Notes**',
      '- Keep at least one other `admin` account or API key.',
    ].join('\n'),
  })
  @ApiParam({
    name: 'username',
    description: 'Username of the account to delete.',
    example: 'operator01',
  })
  @ApiResponse({ status: 200, description: 'Account deleted (or did not exist). Empty body.' })
  async deleteUser(@Param('username') username: string): Promise<void> {
    await this.secretsEngineService.deleteUser(username);
  }

  @Get('users')
  @ApiOperation({
    summary: 'List all user accounts',
    description: [
      'Lists all user accounts.',
      '',
      '**Returns**',
      '- A list of accounts. Each has `username`, `password` and `role`. Treat it as sensitive.',
      '',
      '**Notes**',
      '- Changes made through another gateway instance appear after this instance restarts.',
    ].join('\n'),
  })
  @ApiResponse({ status: 200, type: [UserDetailsDto], description: 'All user accounts. Empty array when there are none.' })
  async getAllUsers(): Promise<UserDetailsDto[]> {
    return this.secretsEngineService.getAllUsers();
  }

  // ---------- API Keys ----------
  @Post('api-keys')
  @ApiOperation({
    summary: 'Create an API key',
    description: [
      'Creates an API key.',
      '',
      '**Send**',
      '- `name`: a label, not used by another key.',
      '- `daysValid`: optional, default 30.',
      '- `role`: `admin`, `superadmin` or `messaging` (default `messaging`).',
      '',
      '**Returns**',
      '- The key in `apiKey`, with `name`, `expiresAt` and `role`.',
      '',
      '**Notes**',
      '- Send the key in the `x-api-key` header.',
      '- An expired key stops working but stays listed until deleted.',
    ].join('\n'),
  })
  @ApiBody({
    description: 'Properties of the new API key.',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Label of the key, for example the integration that uses it. Must not be used by another key.',
          example: 'erp-integration',
        },
        daysValid: {
          type: 'number',
          default: 30,
          description: 'Validity in days, counted from now. Fractions are allowed (`0.5` = 12 hours). It is not range-checked: `0` or a negative value creates a key that is already expired. Defaults to `30` when omitted.',
          example: 90,
        },
        role: {
          type: 'string',
          enum: Object.values(UserRole),
          default: UserRole.MESSAGING,
          description: 'Role granted to requests that use this key. Defaults to `messaging` when omitted.\n' + ROLE_VALUES_DESCRIPTION,
          example: UserRole.MESSAGING,
        },
      },
      required: ['name'],
    },
  })
  @ApiResponse({ status: 201, type: ApiKeyResponseDto, description: 'The created key, including its value in `apiKey`.' })
  @ApiResponse({
    status: 500,
    type: ResponseErrorDto,
    description:
      'Returned with `err.code` `DHCG::UNKNOWN`. `err.reason` tells which case applies:\n' +
      '- `Invalid role "<role>"`: `role` is not one of the documented values.\n' +
      '- `API key with name "<name>" already exists.`: another key already uses this `name`.\n\n' +
      'Also used for storage failures and unexpected internal errors.',
  })
  async createApiKey(
    @Body('name') name: string,
    @Body('daysValid') daysValid: number = 30,
    @Body('role') role: UserRole = UserRole.MESSAGING,
  ): Promise<ApiKeyResponseDto> {
    if (!Object.values(UserRole).includes(role)) {
      throw new BadRequestException(`Invalid role "${role}"`);
    }

    return this.secretsEngineService.createApiKey(name, daysValid, role);
  }

  @Get('api-keys')
  @ApiOperation({
    summary: 'List all API keys',
    description: [
      'Lists all API keys.',
      '',
      '**Returns**',
      '- A list of keys, expired ones included. Each has its value, name, expiry and role.',
    ].join('\n'),
  })
  @ApiResponse({ status: 200, type: [ApiKeyResponseDto], description: 'All API keys. Empty array when there are none.' })
  async getAllApiKeys(): Promise<ApiKeyResponseDto[]> {
    return this.secretsEngineService.getAllApiKeys();
  }

  @Get('api-keys/:apiKey')
  @ApiOperation({
    summary: 'Get an API key',
    description: [
      'Gets one API key.',
      '',
      '**Returns**',
      '- Name, expiry and role of the key, expired or not.',
      '- Empty body for an unknown key.',
    ].join('\n'),
  })
  @ApiParam({ name: 'apiKey', description: API_KEY_PARAM_DESCRIPTION, example: API_KEY_PARAM_EXAMPLE })
  @ApiResponse({ status: 200, type: ApiKeyResponseDto, description: 'The API key. Empty body when the key does not exist.' })
  async getApiKey(@Param('apiKey') apiKey: string): Promise<ApiKeyResponseDto> {
    return this.secretsEngineService.getApiKey(apiKey);
  }

  @Put('api-keys/:apiKey')
  @ApiBody({
    description: 'New properties of the key. The key value itself never changes.',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'New label of the key (send the current one to keep it). A changed name must not be used by another key.',
          example: 'erp-integration',
        },
        daysValid: {
          type: 'number',
          description: 'New validity in days, counted from the time of this call (not from the original creation). Fractions allowed; `0` or negative values expire the key immediately. There is no default on update: omitting it makes the call fail.',
          example: 30,
        },
        role: {
          type: 'string',
          enum: Object.values(UserRole),
          description: 'New role of the key. When omitted the current role is kept (or `messaging` if the key has none).\n' + ROLE_VALUES_DESCRIPTION,
          example: UserRole.ADMIN,
        },
      },
      required: ['name', 'daysValid'],
    },
  })
  @ApiOperation({
    summary: 'Update the name, validity and role of an API key',
    description: [
      'Changes the name, validity or role of an API key. The key itself stays the same.',
      '',
      '**Send**',
      '- `name`: the current name to keep it, or a new name not used by another key.',
      '- `daysValid`: the key works this many days from now. Also renews an expired key.',
      '- `role`: optional; omit it to keep the current role.',
    ].join('\n'),
  })
  @ApiParam({ name: 'apiKey', description: API_KEY_PARAM_DESCRIPTION, example: API_KEY_PARAM_EXAMPLE })
  @ApiResponse({ status: 200, type: ApiKeyResponseDto, description: 'The updated key.' })
  @ApiResponse({
    status: 500,
    type: ResponseErrorDto,
    description:
      'Returned with `err.code` `DHCG::UNKNOWN`. `err.reason` tells which case applies:\n' +
      '- `Invalid role "<role>"`: `role` is not one of the documented values.\n' +
      '- `API key "<apiKey>" not found.` or another "not found" message: the key does not exist.\n' +
      '- `API key with name "<name>" already exists.`: another key already uses the new `name`.\n' +
      '- `Invalid time value`: `daysValid` is missing or not a number.\n\n' +
      'Also used for unexpected internal errors.',
  })
  async updateApiKey(
    @Param('apiKey') apiKey: string,
    @Body() body: { name: string; daysValid: number; role?: UserRole },
  ): Promise<ApiKeyResponseDto> {
    if (body.role && !Object.values(UserRole).includes(body.role)) {
      throw new BadRequestException(`Invalid role "${body.role}"`);
    }

    return this.secretsEngineService.updateApiKey(apiKey, body.name, body.daysValid, body.role);
  }

  @Delete('api-keys/:apiKey')
  @ApiOperation({
    summary: 'Delete an API key',
    description: [
      'Deletes an API key.',
      '',
      '**Notes**',
      '- Always returns `200`, also for an unknown key.',
    ].join('\n'),
  })
  @ApiParam({ name: 'apiKey', description: API_KEY_PARAM_DESCRIPTION, example: API_KEY_PARAM_EXAMPLE })
  @ApiResponse({ status: 200, description: 'Deletion attempted. Empty body.' })
  async deleteApiKey(@Param('apiKey') apiKey: string): Promise<void> {
    await this.secretsEngineService.deleteApiKey(apiKey);
  }

  @Get('api-keys/:apiKey/validate')
  @ApiOperation({
    summary: 'Check whether an API key is usable',
    description: [
      'Checks whether an API key works.',
      '',
      '**Returns**',
      '- `true` when the key exists and has not expired, otherwise `false`.',
    ].join('\n'),
  })
  @ApiParam({ name: 'apiKey', description: API_KEY_PARAM_DESCRIPTION, example: API_KEY_PARAM_EXAMPLE })
  @ApiResponse({
    status: 200,
    type: Boolean,
    description: '`true` when the key exists and is not expired, `false` when it does not exist or is expired.',
  })
  async validateApiKey(@Param('apiKey') apiKey: string): Promise<boolean> {
    const result = await this.secretsEngineService.validateApiKey(apiKey);

    return result.valid;
  }
}
