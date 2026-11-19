import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApplicationEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';

export class GetApplicationsQueryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: [
      'Role the gateway holds in the application:',
      '- `user`: applications it uses.',
      '- `topiccreator`: applications whose topics it manages.',
      '- Any other value returns an empty list.',
    ].join('\n'),
    example: 'topiccreator',
    type: String,
  })
  public roleName: string;
}

export class ApplicationDTO implements ApplicationEntity {
  @IsString()
  @ApiProperty({
    description: 'Name of the application as defined in its SSI-Hub application definition.',
    type: String,
    example: 'EWDS Demo Application',
  })
  public appName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Logo URL from the SSI-Hub application definition. `null` when the definition has none.',
    type: String,
    nullable: true,
    example: 'https://example.com/assets/app-logo.png',
  })
  public logoUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Website URL from the SSI-Hub application definition. `null` when the definition has none.',
    type: String,
    nullable: true,
    example: 'https://example.com',
  })
  public websiteUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Free text description from the SSI-Hub application definition. `null` when the definition has none.',
    type: String,
    nullable: true,
    example: 'Application owning the market data topics.',
  })
  public description?: string;

  @IsString()
  @ApiProperty({
    description: 'When this gateway first listed the application (ISO 8601).',
    type: String,
    format: 'date-time',
    example: '2026-05-18T11:19:07.000Z',
  })
  public createdDate: Date;

  @IsString()
  @ApiProperty({
    description: 'When this gateway last updated the entry (ISO 8601).',
    type: String,
    format: 'date-time',
    example: '2026-05-18T11:20:07.000Z',
  })
  public updatedDate: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      'SSI-Hub namespace of the application. Topics are owned by an application namespace (`owner` of a topic), so use this value wherever a topic owner is expected.',
    type: String,
    nullable: true,
    example: 'ddhub.apps.energyweb.iam.ewc',
  })
  public namespace?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: [
      'Roles the gateway holds in the application:',
      '- `user`: uses the application (for example its topics in channels).',
      '- `topiccreator`: manages the topics of the application.',
    ].join('\n'),
    type: [String],
    example: ['user', 'topiccreator'],
  })
  public roles: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      'Number of topics owned by the application namespace, as reported by the EWDS Message Broker at the last refresh. `0` when the broker reported none.',
    type: Number,
    nullable: true,
    example: 4,
  })
  public topicsCount?: number;
}
