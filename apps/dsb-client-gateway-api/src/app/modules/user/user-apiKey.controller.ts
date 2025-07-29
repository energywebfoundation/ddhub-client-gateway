import { Roles, UserGuard, UserRole } from "@dsb-client-gateway/ddhub-client-gateway-user-roles";
import { SecretsEngineService } from "@dsb-client-gateway/dsb-client-gateway-secrets-engine";
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiKeyResponseDto } from "./dto/response/apikey-response.dto";

@Controller('user-api-key')
@ApiTags('User-ApiKey')
@UseGuards(UserGuard)
@Roles(UserRole.ADMIN)
export class UserApiKeyController {
  constructor(private readonly secretsEngineService: SecretsEngineService) { }

  @Post('set-password')
  @ApiOperation({ summary: 'Set user password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async setUserPassword(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<void> {
    await this.secretsEngineService.setUserPassword(username, password);
  }

  @Delete('user/:username')
  @ApiOperation({ summary: 'Delete a user' })
  async deleteUser(@Param('username') username: string): Promise<void> {
    await this.secretsEngineService.delateUser(username);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create an API key' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        daysValid: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 201, type: ApiKeyResponseDto })
  async createApiKey(
    @Body('name') name: string,
    @Body('daysValid') daysValid: number = 30,
  ): Promise<ApiKeyResponseDto> {
    return this.secretsEngineService.createApiKey(name, daysValid);
  }

  @Delete(':apiKey')
  @ApiOperation({ summary: 'Delete an API key' })
  @ApiResponse({ status: 200, type: Boolean })
  async deleteApiKey(@Param('apiKey') apiKey: string): Promise<boolean> {
    return this.secretsEngineService.deleteApiKey(apiKey);
  }

  @Get(':apiKey')
  @ApiOperation({ summary: 'Get a specific API key' })
  @ApiResponse({ status: 200, type: ApiKeyResponseDto })
  async getApiKey(@Param('apiKey') apiKey: string): Promise<ApiKeyResponseDto> {
    return this.secretsEngineService.getApiKey(apiKey);
  }

  @Get()
  @ApiOperation({ summary: 'Get all API keys' })
  @ApiResponse({ status: 200, type: [ApiKeyResponseDto] })
  async getAllApiKeys(): Promise<ApiKeyResponseDto[]> {
    return this.secretsEngineService.getAllApiKeys();
  }

  @Get('validate/:apiKey')
  @ApiOperation({ summary: 'Validate an API key' })
  @ApiResponse({ status: 200, type: Boolean })
  async validateApiKey(@Param('apiKey') apiKey: string): Promise<boolean> {
    return this.secretsEngineService.validateApiKey(apiKey);
  }
}