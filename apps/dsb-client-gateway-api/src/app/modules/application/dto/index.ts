import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApplicationEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';

export class GetApplicationsQueryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'topiccreator',
    type: String,
  })
  public roleName: string;
}

export class ApplicationDTO implements ApplicationEntity {
  @IsString()
  @ApiProperty({
    description: 'app Name',
    type: String,
    example: 'application.something',
  })
  public appName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'url of the logo',
    type: String,
    example: 'url of the logo',
  })
  public logoUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'url of the website',
    type: String,
    example: 'url of the website',
  })
  public websiteUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'description of the app',
    type: String,
    example: 'description',
  })
  public description?: string;

  @IsString()
  @ApiProperty({
    description: 'When application got stored in cache',
    type: String,
    example: '2022-05-18T11:19:07.000Z',
  })
  public createdDate: Date;

  @IsString()
  @ApiProperty({
    description: 'When application got stored in cache',
    type: String,
    example: '2022-05-18T11:19:07.000Z',
  })
  public updatedDate: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'application namespace',
    type: String,
    example: 'ddhub.apps.energyweb.iam.ewc',
  })
  public namespace?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'application assigned roles',
    type: [String],
    example: ['user', 'topiccreator'],
  })
  public roles: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'number of topics',
    type: Number,
    example: '4',
  })
  public topicsCount?: number;
}
