import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebSocket, WebSocketServer as Server } from 'ws';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebSocketImplementation } from '../message.const';
import { AuthService } from '../../utils/service/auth.service';
import { ChannelService } from '../../channel/service/channel.service';
import { MessageService } from '../service/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/events'
})
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayInit {
  @WebSocketServer()
  public server: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private readonly protocol: string = 'ddhub-protocol';

  constructor(
    protected readonly configService: ConfigService,
    protected readonly authService: AuthService,
    protected readonly channelService: ChannelService,
    @Inject(forwardRef(() => MessageService))
    protected readonly messageService: MessageService,
  ) { }

  public async afterInit(server: Server) {
    const websocketMode = this.configService.get(
      'WEBSOCKET',
      WebSocketImplementation.NONE
    );

    if (websocketMode !== WebSocketImplementation.SERVER) {
      this.logger.log(
        'Closing websocket server because WEBSOCKET is not SERVER'
      );
      server.close();

      return;
    }

    // NestJS does not populate socket with HEADERS which we need to authentication.
    // Also Auth Guards do not work with HandleConnection, that's why we are not using Guards
    server.on('connection', (socket, request) => {
      socket['request'] = request;
    });
  }

  public async handleConnection(
    client: WebSocket & { request: any },
    a: any[],
    b: any
  ): Promise<void> {
    const protocol = client.protocol;

    if (protocol !== this.protocol) {
      client.close(1002, 'Protocol Not Supported');

      return;
    }

    const _clientId = new URLSearchParams(client.request.url.split("?")[1]).get("clientId");
    const _size = new URLSearchParams(client.request.url.split("?")[1]).get("size");

    if (_clientId === null) {
      client.close(1003, 'Required paramater \'clientId\' ex. ws://localhost:3333/events?clientId=id_name');
      return;
    }

    const clientIdRegex = new RegExp(/^[a-zA-Z0-9\-:]+$/);
    if (!clientIdRegex.test(_clientId)) {
      client.close(1003, 'Required paramater \'clientId\' with format Alphanumeric string');
      return;
    }

    const authHeaderTokenValue: string | undefined =
      client.request.headers['authorization'];

    if (!authHeaderTokenValue && this.authService.isAuthEnabled()) {
      this.logger.warn('Login attempt without token');

      client.close(1000, 'Forbidden');

      return;
    }

    const isAuthorized = this.authService.isAuthorized(authHeaderTokenValue);

    if (!isAuthorized) {
      this.logger.warn(`Attempt to login with incorrect username/password`);

      client.close(1000, 'Forbidden');

      return;
    }

    this.logger.log('New client connected');
  }

  @SubscribeMessage('message')
  public async handleMessage(@ConnectedSocket() client: any, @MessageBody() data): Promise<void> {
    this.logger.log(`${client.request.connection.remoteAddress}:${client.request.connection.remotePort}${client.request.url} ${JSON.stringify(data)}`);
    this.messageService.sendMessage(data).then((response) => {
      client.send(JSON.stringify(response));
    }).catch((ex) => {
      this.logger.error(`${client.request.connection.remoteAddress}:${client.request.connection.remotePort}${client.request.url} ${JSON.stringify(ex.response)}`);
      client.send(JSON.stringify(ex.response));
    });
  }
}
