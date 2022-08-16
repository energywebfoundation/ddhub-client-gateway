import { Injectable, Logger } from '@nestjs/common';
import { DdhubBaseService } from './ddhub-base.service';
import { HttpService } from '@nestjs/axios';
import { RetryConfigService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { DidAuthService } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';
import { TlsAgentService } from './tls-agent.service';
import { Span } from 'nestjs-otel';

import { OperationOptions } from 'retry';
import {
  GetInternalMessageResponse,
  GetMessagesResponse,
  Message,
  SendInternalMessageRequestDTO,
  SendInternalMessageResponse,
  SendMessageData,
} from '../dto/message.interface';
import { SendMessageResponse } from '../dto';
import { DdhubLoginService } from './ddhub-login.service';

@Injectable()
export class DdhubMessagesService extends DdhubBaseService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly retryConfigService: RetryConfigService,
    protected readonly didAuthService: DidAuthService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly ddhubLoginService: DdhubLoginService
  ) {
    super(
      new Logger(DdhubMessagesService.name),
      retryConfigService,
      ddhubLoginService,
      tlsAgentService
    );
  }

  @Span('ddhub_mb_retention')
  public async getMessageRetention(): Promise<number> {
    return 24;
  }

  @Span('ddhub_mb_messagesSearch')
  public async messagesSearch(
    topicId: string[],
    senderId: string[],
    clientId?: string,
    from?: string,
    amount?: number
  ): Promise<GetMessagesResponse[]> {
    const requestBody = {
      topicId,
      clientId,
      amount,
      from,
      senderId,
    };

    try {
      const result = await this.request<GetMessagesResponse[]>(
        () =>
          this.httpService.post('/messages/search', requestBody, {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log('messages search successful');

      return result.data;
    } catch (e) {
      this.logger.error('messages search failed', e);
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
          this.httpService.get('/messages', {
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
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log(`get messages successful for fqcn: ${fqcn}`);

      return result.data;
    } catch (e) {
      this.logger.error(`get messages failed for fqcn: ${fqcn}`, e);
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
          this.httpService.post('/messages', messageData, {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        }
      );

      this.logger.log('send message successful', result);

      return result.data;
    } catch (e) {
      this.logger.error('send message failed', e);
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
          this.httpService.post('/messages/internal', requestData, {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
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
          this.httpService.post('/messages/internal/search', dto, {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: ['10'],
        },
        overrideRetry
      );

      this.logger.log(`get symmetric keys successful with dto:`, dto);

      return data;
    } catch (e) {
      this.logger.error(`get symmetric keys failed with dto:`, dto, e);
      throw e;
    }
  }
}
