import { Injectable, Logger } from '@nestjs/common';
import { DdhubBaseService } from './ddhub-base.service';
import { HttpService } from '@nestjs/axios';
import { RetryConfigService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DidAuthService } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';
import { TlsAgentService } from '@dsb-client-gateway/ddhub-client-gateway-tls-agent';
import { Span } from 'nestjs-otel';
import { timeout } from 'rxjs';

import { OperationOptions } from 'retry';
import {
  AckResponse,
  GetInternalMessageResponse,
  Message,
  SearchMessageResponseDto,
  SendInternalMessageRequestDTO,
  SendInternalMessageResponse,
  SendMessageData,
} from '../dto/message.interface';
import { SendMessageResponse } from '../dto';
import { DdhubLoginService } from './ddhub-login.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DdhubMessagesService extends DdhubBaseService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly retryConfigService: RetryConfigService,
    protected readonly didAuthService: DidAuthService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly ddhubLoginService: DdhubLoginService,
    protected readonly configService: ConfigService
  ) {
    super(
      new Logger(DdhubMessagesService.name),
      retryConfigService,
      ddhubLoginService,
      tlsAgentService
    );
  }

  @Span('ddhub_mb_messagesAckBy')
  public async messagesAckBy(
    messageIds: string[],
    clientId?: string,
    from?: string
  ): Promise<AckResponse> {
    const requestBody = {
      messageIds,
      clientId,
      from,
    };

    try {
      const result = await this.request<AckResponse>(
        () =>
          this.httpService
            .post('/messages/ack', requestBody, {
              httpsAgent: this.tlsAgentService.get(),
              headers: {
                Authorization: `Bearer ${this.didAuthService.getToken()}`,
              },
            })
            .pipe(
              timeout(
                +this.configService.get<number>('MESSAGING_MAX_TIMEOUT', 60000)
              )
            ),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      const idsNotAck: string[] = messageIds.filter(
        (id) => !result.data.acked.includes(id)
      );
      if (idsNotAck.length === 0) {
        this.logger.log('messages ack successful', result.data);
      } else {
        this.logger.log('messages not ack', result.data);
        this.logger.error(
          `['/messages/ack'][post]${JSON.stringify(requestBody)}`
        );
      }

      return result.data;
    } catch (e) {
      this.logger.error('messages ack failed', e);
      this.logger.error(
        `['/messages/ack'][post]${JSON.stringify(requestBody)}`
      );
      throw e;
    }
  }

  @Span('ddhub_mb_messagesSearch')
  public async messagesSearch(
    fqcnTopicList: string[],
    senderId: string[],
    topicId?: string[],
    clientId?: string,
    from?: string,
    amount?: number,
    anonymousRecipient?: string
  ): Promise<SearchMessageResponseDto[]> {
    const requestBody = {
      topicId,
      fqcnTopicList,
      clientId,
      amount,
      from,
      senderId,
    };

    try {
      const result = await this.request<SearchMessageResponseDto[]>(
        () =>
          this.httpService
            .post('/messages/search', requestBody, {
              httpsAgent: this.tlsAgentService.get(),
              headers: {
                Authorization: `Bearer ${this.didAuthService.getToken()}`,
              },
            })
            .pipe(
              timeout(
                +this.configService.get<number>('MESSAGING_MAX_TIMEOUT', 60000)
              )
            ),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log('messages search successful', result);

      return result.data;
    } catch (e) {
      this.logger.error('messages search failed', e);
      this.logger.error(
        `['/messages/search'][post]${JSON.stringify(requestBody)}`
      );
      throw e;
    }
  }

  @Span('ddhub_mb_getMessages')
  public async getMessages(
    fqcn: string,
    from?: string,
    clientId?: string,
    amount?: number
  ): Promise<Message[]> {
    try {
      const result = await this.request<null>(
        () =>
          this.httpService
            .get('/messages', {
              httpsAgent: this.tlsAgentService.get(),
              params: {
                fqcn,
                from,
                clientId,
                amount,
              },
              headers: {
                Authorization: `Bearer ${this.didAuthService.getToken()}`,
              },
            })
            .pipe(
              timeout(
                +this.configService.get<number>('MESSAGING_MAX_TIMEOUT', 60000)
              )
            ),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(`get messages successful for fqcn: ${fqcn}`);

      return result.data;
    } catch (e) {
      this.logger.error(`get messages failed for fqcn: ${fqcn}`, e);
      this.logger.error(
        `['/messages'][get]${JSON.stringify({
          fqcn,
          from,
          clientId,
          amount,
        })}`
      );
      throw e;
    }
  }

  @Span('ddhub_mb_sendMessage')
  public async sendMessage(
    fqcns: string[],
    payload: string,
    topicId: string,
    topicVersion: string,
    signature: string,
    clientGatewayMessageId: string,
    payloadEncryption: boolean,
    anonymousRecipient: string[],
    transactionId?: string
  ): Promise<SendMessageResponse> {
    const messageData: SendMessageData = {
      fqcns,
      transactionId,
      payload: payload,
      topicId,
      topicVersion,
      signature,
      clientGatewayMessageId,
      payloadEncryption,
    };

    try {
      const result = await this.request<null>(
        () =>
          this.httpService
            .post('/messages', messageData, {
              httpsAgent: this.tlsAgentService.get(),
              headers: {
                Authorization: `Bearer ${this.didAuthService.getToken()}`,
              },
            })
            .pipe(
              timeout(
                +this.configService.get<number>('MESSAGING_MAX_TIMEOUT', 60000)
              )
            ),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log('send message successful', result);

      return result.data;
    } catch (e) {
      this.logger.error('send message failed', e);
      this.logger.error(`['/messages'][post]${JSON.stringify(messageData)}`);
      throw e;
    }
  }

  @Span('ddhub_mb_sendMessageInternal')
  public async sendMessageInternal(
    fqcn: string,
    clientGatewayMessageId: string,
    payload: string
  ): Promise<SendInternalMessageResponse> {
    const requestData: SendInternalMessageRequestDTO = {
      fqcn,
      clientGatewayMessageId,
      payload: payload,
    };

    try {
      const result = await this.request<null>(
        () =>
          this.httpService
            .post('/messages/internal', requestData, {
              httpsAgent: this.tlsAgentService.get(),
              headers: {
                Authorization: `Bearer ${this.didAuthService.getToken()}`,
              },
            })
            .pipe(
              timeout(
                +this.configService.get<number>('MESSAGING_MAX_TIMEOUT', 60000)
              )
            ),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(
        `send message internal successful with clientGatewayMessageId: ${clientGatewayMessageId}`
      );

      return result.data;
    } catch (e) {
      this.logger.error(
        `send message internal failed with clientGatewayMessageId: ${clientGatewayMessageId}`,
        e
      );
      this.logger.error(
        `['/messages/internal'][post]${JSON.stringify(requestData)}`
      );
      throw e;
    }
  }

  @Span('ddhub_mb_getSymmetricKeys')
  public async getSymmetricKeys(
    dto: { clientId: string; amount: number },
    overrideRetry?: OperationOptions
  ): Promise<GetInternalMessageResponse[]> {
    try {
      const { data } = await this.request<null>(
        () =>
          this.httpService
            .post('/messages/internal/search', dto, {
              httpsAgent: this.tlsAgentService.get(),
              headers: {
                Authorization: `Bearer ${this.didAuthService.getToken()}`,
              },
            })
            .pipe(
              timeout(
                +this.configService.get<number>('MESSAGING_MAX_TIMEOUT', 60000)
              )
            ),
        {
          stopOnResponseCodes: ['10'],
        },
        overrideRetry
      );

      this.logger.log(`get symmetric keys successful with dto:`, dto);

      return data;
    } catch (e) {
      this.logger.error(`get symmetric keys failed with dto:`, dto, e);
      this.logger.error(
        `['/messages/internal/search'][get]${JSON.stringify(dto)}`
      );
      throw e;
    }
  }
}
