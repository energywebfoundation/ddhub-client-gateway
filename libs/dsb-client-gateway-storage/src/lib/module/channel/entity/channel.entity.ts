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

  @Column({
    default: false,
  })
  useAnonymousExtChannel: boolean;

  @Column({
    default: false,
  })
  messageForms: boolean;

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

  @Column({
    default: true,
  })
  payloadEncryption: boolean;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;
}
