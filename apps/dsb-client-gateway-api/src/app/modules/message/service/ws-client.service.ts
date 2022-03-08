import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Message } from '../../dsb-client/dsb-client.interface';
import { ConfigService } from '@nestjs/config';
import { WebSocketImplementation } from '../message.const';
import {
  client as WsClient,
  connection as WsClientConnection,
} from 'websocket';

@Injectable()
export class WsClientService implements OnModuleInit {
  private readonly logger = new Logger(WsClientService.name);
  private ws: WsClient;
  private connection: WsClientConnection;
  private retryCount = 0;

  constructor(protected readonly configService: ConfigService) {}

  public async onModuleInit(): Promise<void> {
    const websocketMode = this.configService.get(
      'WEBSOCKET',
      WebSocketImplementation.NONE
    );

    if (websocketMode === WebSocketImplementation.NONE) {
      this.logger.log(`Websockets are disabled, client is disabled`);

      return;
    }

    const wsUrl: string | undefined = this.configService.get<
      string | undefined
    >('WEBSOCKET_URL');

    if (!wsUrl) {
      this.logger.error('WEBSOCKET_URL is not set');

      return;
    }

    await this.connect();
  }

  private async connect(): Promise<void> {
    const wsUrl: string = this.configService.get<string>('WEBSOCKET_URL');
    const protocol: string =
      this.configService.get<string>('WEBSOCKET_PROTOCOL');

    return new Promise((resolve, reject) => {
      const ws: WsClient = new WsClient();

      ws.on('connectFailed', reject);
      ws.on('connect', (connection) => {
        this.ws = ws;
        resolve();
      });
      try {
        ws.connect(wsUrl, protocol);
      } catch (err) {
        reject(err);
      }
    });
  }

  private async reconnect(reason?: {
    err: string;
    code?: number;
  }): Promise<void> {
    if (!this.canReconnect()) {
      return;
    }
    if (reason) {
      this.logger.log('WebSocket Client error:', reason.code, reason.err);
    }
    this.logger.log(
      `WebSocket Client attempting reconnect [${this.retryCount}]...`
    );

    const reconnectTimeout: number = this.configService.get<number>(
      'WEBSOCKET_RECONNECT_TIMEOUT',
      10000
    );

    const wsUrl: string = this.configService.get<string>('WEBSOCKET_URL');
    const protocol: string =
      this.configService.get<string>('WEBSOCKET_PROTOCOL');

    return new Promise((resolve) => {
      this.ws.on('connectFailed', (err) => {
        console.log('WebSocket Client failed to reconnect:', err.message);
        this.reconnect();
      });
      this.ws.on('connect', (connection) => {
        this.update(connection);
        resolve();
      });
      const timeout = reconnectTimeout ?? 10 * 1000;
      setTimeout(() => {
        this.ws.connect(wsUrl, protocol);
        this.retryCount += 1;
      }, timeout);
    });
  }

  private update(connection: WsClientConnection) {
    this.retryCount = 0;
    this.connection = connection;
  }

  private canReconnect(): boolean {
    const canReconnect: boolean = this.configService.get<boolean>(
      'WEBSOCKET_RECONNECT',
      true
    );

    if (!canReconnect) {
      return false;
    }

    const reconnectMaxRetries: number = this.configService.get<number>(
      'WEBSOCKET_RECONNECT_MAX_RETRIES',
      10
    );

    const maxRetries = reconnectMaxRetries ?? 10;
    return this.retryCount < maxRetries;
  }

  public async sendMessage(messages: Message[]): Promise<void> {}
}
