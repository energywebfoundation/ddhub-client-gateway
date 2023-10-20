import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SendMessageDto,
  uploadMessageBodyDto,
} from '../dto/request/send-message.dto';
import { GetMessagesDto } from '../dto/request/get-messages.dto';
import { DownloadMessagesDto } from '../dto/request/download-file.dto';
import { MessageService } from '../service/message.service';
import { SendMessagelResponseDto } from '../dto/response/send-message.dto';
import { GetMessagesResponseDto } from '../dto/response/get-message-response.dto';
import { DownloadMessageResponse } from '../entity/message.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { MtlsGuard } from '../../certificate/guards/mtls.guard';
import { PinoLogger } from 'nestjs-pino';
import { ClientsInterceptor } from '@dsb-client-gateway/ddhub-client-gateway-clients';
import { GetMessageResponse } from '../message.interface';
import { GetSentMessagesRequestDto } from '../dto/request/get-sent-messages-request.dto';
import { GetSentMessageResponseDto } from '../dto/response/get-sent-message-response.dto';
import { OfflineMessagesService } from '../service/offline-messages.service';
import {
  Roles,
  UserRole,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';

@Controller('messages')
@UseGuards(MtlsGuard, UseGuards)
@ApiTags('Messaging')
export class MessageControlller {
  private readonly logger = new Logger();
  constructor(
    protected readonly messageService: MessageService,
    protected readonly offlineMessagesService: OfflineMessagesService,
    protected readonly pinoLogger: PinoLogger
  ) {}

  @Get('/sent')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message received successfully',
    type: GetSentMessageResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Validation failed or some requirements were not fully satisfied',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Messages Not found',
  })
  @Roles(UserRole.MESSAGING, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  public async getSentMessages(
    @Query() dto: GetSentMessagesRequestDto
  ): Promise<GetSentMessageResponseDto[]> {
    this.pinoLogger.assign({
      fqcn: dto.fqcn,
      topicName: dto.topicName,
      topicOwner: dto.topicOwner,
    });

    return this.offlineMessagesService.getOfflineSentMessages(dto);
  }

  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message received successfully',
    type: [GetMessagesResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Validation failed or some requirements were not fully satisfied',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Messages Not found',
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClientsInterceptor('clientId', 'query', 'fqcn', 'query'))
  @Roles(UserRole.MESSAGING, UserRole.ADMIN)
  public async getMessage(
    @Query() dto: GetMessagesDto
  ): Promise<GetMessageResponse[]> {
    this.pinoLogger.assign({
      fqcn: dto.fqcn,
      topicName: dto.topicName,
      topicOwner: dto.topicOwner,
    });

    return this.messageService.getMessagesWithReqLock(dto);
  }

  @Get('/download')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message download successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Validation failed or some requirements were not fully satisfied',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.MESSAGING, UserRole.ADMIN)
  public async downloadMessage(
    @Query() { fileId }: DownloadMessagesDto,
    @Response() res
  ): Promise<Readable> {
    this.pinoLogger.assign({
      fileId,
    });

    try {
      const file: DownloadMessageResponse =
        await this.messageService.downloadMessages(fileId);

      res.set({
        'Content-Type': 'multipart/form-data',
        'Content-Disposition': `attachment; filename=${file.fileName}`,
        sender: file.sender,
        signature: file.signature,
        clientGatewayMessageId: file.clientGatewayMessageId,
      });

      const stream = Readable.from(file.data);
      return stream.pipe(res);
    } catch (e) {
      this.logger.error('error in file download', e);
      throw e;
    }
  }

  @Post('/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message sent successfully',
    type: () => SendMessagelResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Validation failed or some requirements were not fully satisfied',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Channel not found or Topic not found',
  })
  @UseInterceptors(ClientsInterceptor('clientId', 'body', 'fqcn', 'body'))
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.MESSAGING, UserRole.ADMIN)
  public async create(
    @Body() dto: SendMessageDto
  ): Promise<SendMessagelResponseDto> {
    this.pinoLogger.assign({
      fqcn: dto.fqcn,
      topicName: dto.topicName,
      topicOwner: dto.topicOwner,
    });

    return this.messageService.sendMessage(dto);
  }

  @Post('upload')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'File Upload Successfully',
    type: () => SendMessagelResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Validation failed or some requirements were not fully satisfied',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Channel not found or Topic not found',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.MESSAGING, UserRole.ADMIN)
  public async uploadFile(
    @UploadedFile('file') file: Express.Multer.File,
    @Body() dto: uploadMessageBodyDto
  ): Promise<SendMessagelResponseDto> {
    this.pinoLogger.assign({
      fqcn: dto.fqcn,
      topicName: dto.topicName,
      topicOwner: dto.topicOwner,
    });

    return this.messageService.uploadMessage(file, dto);
  }
}
