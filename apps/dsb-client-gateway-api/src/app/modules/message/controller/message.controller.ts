import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  SendMessageDto,
  uploadMessageBodyDto,
} from '../dto/request/send-message.dto';
import { GetMessagesDto } from '../dto/request/get-messages.dto';
import { DownloadMessagesDto } from '../dto/request/download-file.dto';
import { MessageService } from '../service/message.service';
import { SendMessageResponseDto } from '../dto/response/send-message.dto';
import { GetMessagesResponseDto } from '../dto/response/get-message-response.dto';
import { DownloadMessageResponse } from '../entity/message.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { basename } from 'path';
import { MtlsGuard } from '../../certificate/guards/mtls.guard';
import { PinoLogger } from 'nestjs-pino';
import { ClientsInterceptor } from '@dsb-client-gateway/ddhub-client-gateway-clients';
import { GetMessageResponse } from '../message.interface';
import { GetSentMessagesRequestDto } from '../dto/request/get-sent-messages-request.dto';
import { GetSentMessageResponseDto } from '../dto/response/get-sent-message-response.dto';
import { OfflineMessagesService } from '../service/offline-messages.service';
import {
  Roles,
  UserGuard,
  UserRole,
  Username,
} from '@dsb-client-gateway/ddhub-client-gateway-user-roles';
import { AckMessagesRequestDto } from '../dto/request/ack-messages-request.dto';
import { GetReceivedMessageResponseDto } from '../dto/response/get-received-message-response.dto';
import { ResponseErrorDto } from '../../utils/dto/response-error.dto';
import { SwaggerTags } from '../../../../swagger/swagger.constants';

const BINARY_SCHEMA = { type: 'string', format: 'binary' } as const;

const BROKER_ERRORS_NOTE =
  '`MB::ERROR` / `MB::UNKNOWN` when the message broker rejects or fails the request (`additionalDetails` carries the broker `errorCode`, `errorCodeName`, `errorCodeMessage` and `path`).';

@Controller('messages')
@UseGuards(MtlsGuard, UserGuard)
@ApiTags(SwaggerTags.MESSAGING)
export class MessageController {
  private readonly logger = new Logger();

  constructor(
    protected readonly messageService: MessageService,
    protected readonly offlineMessagesService: OfflineMessagesService,
    protected readonly pinoLogger: PinoLogger
  ) { }

  @Get('/sent/download/:cgwId')
  @ApiOperation({
    summary: 'Download the original copy of a file this gateway sent',
    description: [
      'Downloads the original copy of a file this gateway uploaded.',
      '',
      '**Send**',
      '- `cgwId`: the `clientGatewayMessageId` of the upload (UUID v4).',
      '',
      '**Returns**',
      '- The raw file content, without a file name or content type.',
      '',
      '**Notes**',
      '- A copy exists only for uploads on channels with message forms enabled.',
      '- The copy is kept as long as the Message Broker keeps messages.',
    ].join('\n'),
  })
  @ApiParam({
    name: 'cgwId',
    description: '`clientGatewayMessageId` of the upload (UUID v4). Another value returns `500 DHCG::UNKNOWN`.',
    type: String,
    format: 'uuid',
    example: 'f923afb7-e334-419c-a72c-a60b293184ea',
  })
  @ApiProduces('application/octet-stream')
  @ApiOkResponse({
    description: 'Raw content of the original file.',
    schema: BINARY_SCHEMA,
  })
  @ApiNotFoundResponse({
    description:
      '`DHCG::ROUTE_NOT_FOUND`: no stored file for this ID. The ID is unknown, belongs to a message instead of a file, the channel did not have message forms enabled, or the file has expired.',
    type: ResponseErrorDto,
  })
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  public async downloadOfflineFile(
    @Param('cgwId', new ParseUUIDPipe({ version: '4' }))
    cgwId: string,
    @Response() res
  ) {
    const readable: Readable | null =
      await this.messageService.downloadOfflineUploadedFile(cgwId);

    if (!readable) {
      throw new NotFoundException();
    }

    return readable.pipe(res);
  }

  @Get('/sent')
  @ApiOperation({
    summary: 'List messages and files this gateway sent (message forms)',
    description: [
      'Lists the messages and files this gateway has sent and stored.',
      '',
      '**Send** (all optional)',
      '- `fqcn`: only this channel.',
      '- `topicName`, `topicOwner`: exact match.',
      '- `clientGatewayMessageId`: only this message; other filters and paging are ignored.',
      '- `messageId`, `transactionId`: replies this gateway sent to a received message or transaction.',
      '- `initiatingMessageId`, `initiatingTransactionId`: the original message that a received reply refers to.',
      '- `page`, `limit`: paging (default 5 per page).',
      '',
      '**Returns**',
      '- A list of sent messages, newest first. Each has the original payload, delivery counters and a delivery result for each recipient.',
      '',
      '**Notes**',
      '- Only channels with message forms enabled store messages.',
      '- With a reply filter, `fqcn` is ignored.',
      '- An unknown `clientGatewayMessageId` currently returns `500 DHCG::UNKNOWN`.',
      '- Old messages are removed when `CLEANUP_MESSAGES_CRON_ENABLED=true`.',
    ].join('\n'),
  })
  @ApiOkResponse({
    description:
      'Sent messages matching the filters (possibly empty), newest first.',
    type: GetSentMessageResponseDto,
    isArray: true,
  })
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
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

  @Get('/received')
  @ApiOperation({
    summary: 'List stored received messages (message forms)',
    description: [
      'Lists the messages this gateway has received and stored.',
      '',
      '**Send**',
      '- `fqcn`: required; ignored when a reply filter is given.',
      '- `topicName`, `topicOwner`, `messageId`: exact match.',
      '- `initiatingMessageId`, `initiatingTransactionId`: the message that started a conversation.',
      '- `messageIds`, `transactionId`: replies to those messages or that transaction.',
      '- `amount`: maximum number of messages (default 3). No paging.',
      '',
      '**Returns**',
      '- A list of received messages, newest first. Each has `isRead`, the sender alias and reply counts.',
      '- `decryption.status` is always `NOT_REQUIRED`; `topicSchemaType` is always `JSD7`.',
      '',
      '**Notes**',
      '- Only channels with message forms enabled store messages.',
      '- Listing does not change which new messages you receive; the same messages can be listed again.',
      '- Old messages are removed when `CLEANUP_MESSAGES_CRON_ENABLED=true`.',
    ].join('\n'),
  })
  @ApiOkResponse({
    description:
      'Stored received messages matching the filters (possibly empty), newest first.',
    type: GetReceivedMessageResponseDto,
    isArray: true,
  })
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  public async getReceivedMessages(
    @Query() dto: GetMessagesDto
  ): Promise<GetReceivedMessageResponseDto[]> {
    this.pinoLogger.assign({
      fqcn: dto.fqcn,
      topicName: dto.topicName,
      topicOwner: dto.topicOwner,
    });

    return this.offlineMessagesService.getOfflineReceivedMessages(dto);
  }

  @Post('/ack')
  @ApiOperation({
    summary: 'Mark stored received messages as read',
    description: [
      'Marks received messages as read.',
      '',
      '**Send**',
      '- `messagesIds`: IDs of received messages (at least one).',
      '',
      '**Notes**',
      '- Only sets the read flag (`isRead`); it does not change which new messages you receive.',
      '- Marked for the logged-in user, or for the gateway when there is no user login.',
      '- A message counts as read once any user marked it.',
      '- Unknown IDs are accepted; repeating the call changes nothing.',
    ].join('\n'),
  })
  @ApiBody({ type: AckMessagesRequestDto })
  @ApiNoContentResponse({
    description: 'Messages marked as read. No response body.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
  public async ackMessages(
    @Body() body: AckMessagesRequestDto,
    @Username() username: string
  ): Promise<void> {
    await this.offlineMessagesService.ackMessages(username, body.messagesIds);
  }

  @Get('/')
  @ApiOperation({
    summary: 'Receive messages from a channel',
    description: [
      'Fetches the next new messages of a channel, oldest first.',
      '',
      '**Send**',
      '- `fqcn`: the channel to read.',
      '- `clientId`: name of your integration (letters and digits). Keep it the same between calls.',
      '- `amount`: maximum number of messages.',
      '- `topicName` and `topicOwner`: optional, only this topic (send both).',
      '- `from`: optional start time (ISO 8601). Keep it the same between calls.',
      '',
      '**Returns**',
      '- A list of messages, oldest first, verified and decrypted where needed.',
      '- On file channels, each message carries the `fileId` of a file.',
      '',
      '**Notes**',
      '- Each `clientId` gets every message; callers that share a `clientId` split the messages.',
      '- Delivery is at least once: messages are confirmed on your next call, so handle duplicates (for example by `id`).',
      '- An empty list does not always mean nothing is left; keep polling.',
      '- A call made while another call with the same `clientId` and channel runs returns an empty list.',
      '- Check `signatureValid` and `decryption.status` before trusting `payload`.',
    ].join('\n'),
  })
  @ApiOkResponse({
    description:
      'Messages, oldest first. Empty when there are no new messages, when another call for the same `clientId` and `fqcn` is in progress, or when acknowledging the previous batch failed.',
    type: [GetMessagesResponseDto],
  })
  @ApiBadRequestResponse({
    description: `Possible \`err.code\` values:
- \`VALIDATION::FAILED\`: request validation failed (\`fqcn\` missing, invalid \`clientId\`).
- \`CHANNEL::NOT_FOUND\`: no channel with this \`fqcn\`.
- \`MESSAGING::TOPIC_OWNER_AND_NAME_REQUIRED\`: only one of \`topicName\` / \`topicOwner\` was given.
- \`TOPIC::NOT_RELATED_TO_CHANNEL\`: the topic is not bound to the channel.
- \`BIP39::ASSOCIATION_KEY_NOT_AVAILABLE\`: anonymous external channel, but the gateway has no current association key.
- \`MESSAGING:MAXIMUM_NUMBER_OF_CLIENTS_REACHED\`: registering a new \`clientId\` would exceed the broker limit of clients per gateway.
- ${BROKER_ERRORS_NOTE}`,
    type: ResponseErrorDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClientsInterceptor('clientId', 'query', 'fqcn', 'query'))
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
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
  @ApiOperation({
    summary: 'Download a received file',
    description: [
      'Downloads a file sent to this gateway, checked and decrypted.',
      '',
      '**Send**',
      '- `fileId`: from a file message received on a `download` channel.',
      '',
      '**Returns**',
      '- The raw file content. Treat it as binary, whatever `Content-Type` says.',
      '- Headers: file name (the `fileId`), `sender`, `signature`, `clientGatewayMessageId`.',
      '',
      '**Notes**',
      '- Available as long as the Message Broker keeps the file.',
      '- A signature that does not match fails with `SIG::NO_MATCH`.',
    ].join('\n'),
  })
  @ApiProduces('application/octet-stream')
  @ApiOkResponse({
    description: 'Raw (decrypted) file content.',
    schema: BINARY_SCHEMA,
    headers: {
      'Content-Disposition': {
        description: '`attachment; filename="<fileId>"`.',
        schema: { type: 'string' },
      },
      sender: {
        description: 'DID of the sending gateway.',
        schema: { type: 'string' },
      },
      signature: {
        description: 'Signature of the file created by the sender gateway.',
        schema: { type: 'string' },
      },
      clientGatewayMessageId: {
        description: 'UUID of the send request on the sender gateway.',
        schema: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: `Possible \`err.code\` values:
- \`VALIDATION::FAILED\`: request validation failed (\`fileId\` missing or containing characters other than letters, digits and hyphens).
- \`SIG::NO_MATCH\`: the file signature does not match the sender DID document (\`additionalDetails\`: \`fileId\`, \`receivedSignature\`).
- ${BROKER_ERRORS_NOTE} For example when the broker does not know the \`fileId\` or the file expired.`,
    type: ResponseErrorDto,
  })
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
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
        'Content-Disposition': `attachment; filename="${basename(file.fileName)}"`,
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
  @ApiOperation({
    summary: 'Send a message to a channel',
    description: [
      'Sends a message to every recipient of a `pub` channel.',
      '',
      '**Send**',
      '- `fqcn`: a `pub` channel with at least one recipient.',
      '- `topicName`, `topicOwner`, `topicVersion`: a topic of the channel.',
      '- `payload`: for `JSD7` topics, JSON that matches the topic schema.',
      '- `transactionId`: optional; reaches the recipients unchanged.',
      '- `initiatingMessageId`, `initiatingTransactionId`: optional, when replying.',
      '',
      '**Returns**',
      '- `clientGatewayMessageId` and a list of delivery results, one for each recipient.',
      '',
      '**Notes**',
      '- A `200` means the message was accepted, not that every recipient got it: check `recipients.failed`.',
      '- The message is signed, and encrypted when the channel has `payloadEncryption` enabled.',
      '- Every call sends a new message, even with the same content.',
      '- Needs a configured identity.',
    ].join('\n'),
  })
  @ApiBody({ type: SendMessageDto })
  @ApiOkResponse({
    description:
      'Message accepted. The delivery result for each recipient is in `recipients` and `status`.',
    type: () => SendMessageResponseDto,
  })
  @ApiBadRequestResponse({
    description: `Possible \`err.code\` values:
- \`VALIDATION::FAILED\`: request validation failed (missing fields, invalid \`fqcn\`, invalid \`anonymousRecipient\`).
- \`CHANNEL::NOT_FOUND\`: no channel with this \`fqcn\`.
- \`TOPIC::NOT_FOUND\`: no topic with this name, owner and version is known to the gateway, or it has no schema.
- \`TOPIC::NOT_RELATED_TO_CHANNEL\`: the topic is not bound to the channel.
- \`MESSAGING::RECIPIENTS_NOT_PRESENT\`: the channel has no qualified DIDs.
- \`CHANNEL::TYPE_INVALID\`: the channel is not of type \`pub\`.
- \`MESSAGING::PAYLOAD JSON PARSE FAILED\`: \`JSD7\` topic and \`payload\` is not valid JSON.
- \`ID::NO_PRIVATE_KEY\`: the gateway has no private key to sign with.
- \`MESSAGING:MAXIMUM_NUMBER_OF_CLIENTS_REACHED\`: only when the body also contains a \`clientId\` field that would register a new client above the broker limit.
- ${BROKER_ERRORS_NOTE}`,
    type: ResponseErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description:
      '`DDHUB::INVALID_PAYLOAD`: the payload does not match the topic JSON Schema, or the schema itself cannot be compiled. `additionalDetails` holds the first JSON Schema validation error (`instancePath`, `schemaPath`, `keyword`, `params`, `message`).',
    type: ResponseErrorDto,
  })
  @UseInterceptors(ClientsInterceptor('clientId', 'body', 'fqcn', 'body'))
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
  public async create(
    @Body() dto: SendMessageDto
  ): Promise<SendMessageResponseDto> {
    this.pinoLogger.assign({
      fqcn: dto.fqcn,
      topicName: dto.topicName,
      topicOwner: dto.topicOwner,
    });

    return this.messageService.sendMessage(dto);
  }

  @Post('upload')
  @ApiOperation({
    summary: 'Send a CSV file to a channel',
    description: [
      'Sends a CSV file to every recipient of an `upload` channel.',
      '',
      '**Send** (form upload)',
      '- `file`: CSV file (`text/csv`), at most `MAX_FILE_SIZE` (default 100 MB).',
      '- `fqcn`: an `upload` channel with at least one recipient.',
      '- `topicName`, `topicOwner`, `topicVersion`: a topic of the channel.',
      '- `transactionId`: optional.',
      '',
      '**Returns**',
      '- `clientGatewayMessageId` and a list of delivery results, one for each recipient.',
      '',
      '**Notes**',
      '- A `200` does not mean every recipient got the file: check `recipients.failed`.',
      '- The file is signed, and encrypted when the channel has `payloadEncryption` enabled.',
      '- The content is not checked against the topic schema.',
      '- Needs a configured identity.',
    ].join('\n'),
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: uploadMessageBodyDto })
  @ApiCreatedResponse({
    description:
      'File accepted. The delivery result for each recipient is in `recipients` and `status`.',
    type: () => SendMessageResponseDto,
  })
  @ApiBadRequestResponse({
    description: `Possible \`err.code\` values:
- \`VALIDATION::FAILED\`: request validation failed (missing fields, invalid \`fqcn\`).
- \`MESSAGING::FILE_TYPE_NOT_MATCHED\`: the \`file\` part is not \`text/csv\`.
- \`MESSAGING::FILE_SIZE_GREATER_THEN_100_MB\`: the file is larger than \`MAX_FILE_SIZE\` (\`additionalDetails.maxFileSize\`).
- \`CHANNEL::NOT_FOUND\`: no channel with this \`fqcn\`.
- \`TOPIC::NOT_FOUND\`: the topic version has no schema or ID.
- \`TOPIC::NOT_RELATED_TO_CHANNEL\`: the topic is not bound to the channel.
- \`CHANNEL::TYPE_INVALID\`: the channel is not of type \`upload\`.
- \`MESSAGING::RECIPIENTS_NOT_PRESENT\`: the channel has no qualified DIDs.
- ${BROKER_ERRORS_NOTE}`,
    type: ResponseErrorDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.MESSAGING, UserRole.ADMIN, UserRole.SUPERADMIN)
  public async uploadFile(
    @UploadedFile('file') file: Express.Multer.File,
    @Body() dto: uploadMessageBodyDto
  ): Promise<SendMessageResponseDto> {
    this.pinoLogger.assign({
      fqcn: dto.fqcn,
      topicName: dto.topicName,
      topicOwner: dto.topicOwner,
    });

    return this.messageService.uploadMessage(file, dto);
  }
}
