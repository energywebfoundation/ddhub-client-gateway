import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsArray,
  ArrayUnique,
  IsNumber
} from 'class-validator';
import { Topic } from '../dsb-client.interface';

export class FileUploadBodyDto {
  @IsString()
  @IsNotEmpty()
  public fqcn: string;

  @IsString()
  @IsNotEmpty()
  public topicId: string;

  @IsString()
  @IsNotEmpty()
  public fileName: string;
}

export class SendMessageBodyDto {
  @IsString()
  @IsNotEmpty()
  public fqcn: string;

  @IsString()
  @IsNotEmpty()
  public topic: string;

  @IsNotEmpty()
  public payload: object;
}

export class GetMessagesQueryDto {
  @IsNotEmpty()
  @IsString()
  public fqcn: string;

  @IsPositive()
  @IsOptional()
  public amount?: number;

  @IsDateString()
  @IsOptional()
  public from?: string;

  @IsString()
  @IsOptional()
  public clientId?: string;
}

export class GetApplicationsQueryDto {
  @IsNotEmpty()
  @IsString()
  public ownerDid: string;
}

export class GetTopicsCountQueryDto {
  @IsNotEmpty()
  @ArrayUnique()
  @IsString()
  public owner: string[];
}

export class PaginatedResponse {

  @IsNumber()
  public count: number;
  @IsNumber()
  public limit: number;
  @IsNumber()
  public page: number;
  @ArrayUnique()
  @IsArray()
  public records: Topic[]

}


