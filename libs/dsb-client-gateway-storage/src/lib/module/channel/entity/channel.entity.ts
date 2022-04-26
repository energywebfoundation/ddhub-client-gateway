// import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
// import { Type } from 'class-transformer';
// import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
// import { ChannelSRepository } from '../repository/channel-s.repository';
//
// export enum ChannelType {
//   PUB = 'pub',
//   SUB = 'sub',
//   DOWNLOAD = 'download',
//   UPLOAD = 'upload',
// }
//
// export class ChannelTopic {
//   topicName: string;
//   owner: string;
//   topicId: string;
// }
//
// export class ChannelConditions {
//   @IsOptional()
//   @IsString({
//     each: true,
//   })
//   dids: string[] = [];
//
//   @IsString({
//     each: true,
//   })
//   @IsOptional()
//   roles: string[] = [];
//
//   @IsOptional()
//   @IsString({
//     each: true,
//   })
//   topics: ChannelTopic[] = [];
//
//   topicsVersions: { [topicId: string]: any[] };
//
//   @IsOptional()
//   @IsString({
//     each: true,
//   })
//   qualifiedDids: string[];
// }
//
// @Entity({
//   tableName: 'channel',
//   customRepository: () => ChannelSRepository,
// })
// export class ChannelEntity {
//   @IsString()
//   @PrimaryKey()
//   fqcn: string;
//
//   @IsEnum(ChannelType)
//   @Property()
//   type: ChannelType;
//
//   @ValidateNested()
//   @IsOptional()
//   @Type(() => ChannelConditions)
//   conditions: ChannelConditions;
//
//   createdAt: string;
//   updatedAt: string;
// }

import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelType } from '../channel.const';

export class ChannelTopic {
  topicName: string;
  owner: string;
  topicId: string;
}

export class ChannelConditions {
  @IsOptional()
  @IsString({
    each: true,
  })
  dids: string[] = [];

  @IsString({
    each: true,
  })
  @IsOptional()
  roles: string[] = [];

  @IsOptional()
  @IsString({
    each: true,
  })
  topics: ChannelTopic[] = [];

  topicsVersions: { [topicId: string]: any[] };

  @IsOptional()
  @IsString({
    each: true,
  })
  qualifiedDids: string[];
}

@Entity('channels')
export class ChannelEntity {
  @IsString()
  @PrimaryColumn()
  fqcn: string;

  @IsEnum(ChannelType)
  @Column({
    enum: [
      ChannelType.PUB,
      ChannelType.SUB,
      ChannelType.DOWNLOAD,
      ChannelType.UPLOAD,
    ],
    type: 'text',
  })
  type: ChannelType;

  @Column({
    type: 'text',
    transformer: {
      to(value: any): any {
        return JSON.stringify(value);
      },
      from(value: any): any {
        return JSON.parse(value);
      },
    },
  })
  conditions: ChannelConditions;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;
}
