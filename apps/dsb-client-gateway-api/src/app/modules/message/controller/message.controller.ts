import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Get,
  Res,
  StreamableFile,
  Req,
  Response,
} from '@nestjs/common';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SendMessageDto,
  uploadMessageBodyDto,
} from '../dto/request/send-message.dto';
import { GetMessagesDto } from '../dto/request/get-messages.dto';
import { DownloadMessagesDto } from '../dto/request/download-file.dto';
import { MessageService } from '../service/message.service';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { SendMessagelResponseDto } from '../dto/response/send-message.dto';
import { GetMessagesResponseDto } from '../dto/response/get-message-response.dto';
import { DownloadMessageResponse } from '../entity/message.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('messages')
@UseGuards(DigestGuard)
@ApiTags('Messaging')
export class MessageControlller {
  constructor(protected readonly messageService: MessageService) {}

  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message recieved successfully',
    type: () => GetMessagesResponseDto,
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
  public async getMessage(@Query() dto: GetMessagesDto): Promise<Array<any>> {
    return this.messageService.getMessages(dto);
  }

  @Get('/download')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message Dwonloaded successfully',
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
  public async downloadMessage(
    @Query() { fileId }: DownloadMessagesDto,
    @Response({ passthrough: true }) res
  ): Promise<StreamableFile> {
    await this.messageService.downloadMessages(fileId);

    const file: DownloadMessageResponse =
      await this.messageService.downloadMessages(fileId);

    res.set({
      'Content-Type': 'multipart/form-data',
      'Content-Disposition': `attachment; filename=${file.fileName}`,
      sender: file.sender,
      signature: file.signature,
      clientGatewayMessageId: file.clientGatewayMessageId,
    });

    try {
      const readStream = fs.createReadStream(file.filePath);
      readStream.on('data', (chunk) => console.log(chunk));
      readStream.on('end', () => console.log('done'));
      readStream.on('error', (err) => {
        console.error('error in readtream', err);
      });
      return new StreamableFile(readStream);
    } catch (e) {
      console.error('error in catch directly', e);
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
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() dto: SendMessageDto
  ): Promise<SendMessagelResponseDto> {
    return this.messageService.sendMessage(dto);
  }

  @Post('upload')
  @ApiResponse({
    status: HttpStatus.OK,
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
  public async uploadFile(
    @UploadedFile('file') file: Express.Multer.File,
    @Body() dto: uploadMessageBodyDto
  ): Promise<SendMessagelResponseDto> {
    return this.messageService.uploadMessage(file, dto);
  }
}
