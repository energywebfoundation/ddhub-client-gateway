import { Roles, UserGuard, Username, UserRole } from "@dsb-client-gateway/ddhub-client-gateway-user-roles";
import { SecretsEngineService } from "@dsb-client-gateway/dsb-client-gateway-secrets-engine";
import { BadRequestException, Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiKeyResponseDto } from "./dto/response/apikey-response.dto";
import { UserDetailsDto } from "./dto/response/user-response.dto";

@Controller('user-api-key')
@ApiTags('User-ApiKey')
@UseGuards(UserGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
export class UserApiKeyController {
  constructor(private readonly secretsEngineService: SecretsEngineService) { }

  // ---------- Current User ----------
  @Get('users/me')
  @UseGuards(UserGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Get current user details' })
  @ApiResponse({ status: 200, type: UserDetailsDto })
  async getCurrentUser(@Username() username: string): Promise<UserDetailsDto> {
    return this.secretsEngineService.getUserAuthDetails(username);
  }

  // ---------- Users ----------
  @Post('users')
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        role: { type: 'string', enum: Object.values(UserRole) },
      },
      required: ['username', 'password', 'role'],
    },
  })
  async setUserPassword(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('role') role: UserRole,
  ): Promise<void> {
    if (role === UserRole.SUPERADMIN) {
      throw new BadRequestException('Creating SUPERADMIN users is not allowed');
    }

    const exists = await this.secretsEngineService.userExists(username);
    if (exists) {
      throw new ConflictException('User already exists');
    }

    await this.secretsEngineService.setUserPassword(username, password, role);
  }

  @Put('users')
  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
    },
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
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  async deleteUser(@Param('username') username: string): Promise<void> {
    await this.secretsEngineService.deleteUser(username);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserDetailsDto] })
  async getAllUsers(): Promise<UserDetailsDto[]> {
    return this.secretsEngineService.getAllUsers();
  }

  // ---------- API Keys ----------
  @Post('api-keys')
  @ApiOperation({ summary: 'Create an API key' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        daysValid: { type: 'number', default: 30 },
      },
      required: ['name'],
    },
  })
  @ApiResponse({ status: 201, type: ApiKeyResponseDto })
  async createApiKey(
    @Body('name') name: string,
    @Body('daysValid') daysValid: number = 30,
  ): Promise<ApiKeyResponseDto> {
    return this.secretsEngineService.createApiKey(name, daysValid);
  }

  @Get('api-keys')
  @ApiOperation({ summary: 'Get all API keys' })
  @ApiResponse({ status: 200, type: [ApiKeyResponseDto] })
  async getAllApiKeys(): Promise<ApiKeyResponseDto[]> {
    return this.secretsEngineService.getAllApiKeys();
  }

  @Get('api-keys/:apiKey')
  @ApiOperation({ summary: 'Get a specific API key' })
  @ApiResponse({ status: 200, type: ApiKeyResponseDto })
  async getApiKey(@Param('apiKey') apiKey: string): Promise<ApiKeyResponseDto> {
    return this.secretsEngineService.getApiKey(apiKey);
  }

  @Put('api-keys/:apiKey')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        daysValid: { type: 'number', default: 30 },
      },
      required: ['name'],
    },
  })
  @ApiOperation({ summary: 'Update an API key (name & daysValid)' })
  @ApiResponse({ status: 200, type: ApiKeyResponseDto })
  async updateApiKey(
    @Param('apiKey') apiKey: string,
    @Body() body: { name: string; daysValid: number },
  ): Promise<ApiKeyResponseDto> {
    return this.secretsEngineService.updateApiKey(apiKey, body.name, body.daysValid);
  }

  @Delete('api-keys/:apiKey')
  @ApiOperation({ summary: 'Delete an API key' })
  @ApiResponse({ status: 204, description: 'API key deleted successfully' })
  async deleteApiKey(@Param('apiKey') apiKey: string): Promise<void> {
    await this.secretsEngineService.deleteApiKey(apiKey);
  }

  @Get('api-keys/:apiKey/validate')
  @ApiOperation({ summary: 'Validate an API key' })
  @ApiResponse({ status: 200, type: Boolean })
  async validateApiKey(@Param('apiKey') apiKey: string): Promise<boolean> {
    return this.secretsEngineService.validateApiKey(apiKey);
  }
}
