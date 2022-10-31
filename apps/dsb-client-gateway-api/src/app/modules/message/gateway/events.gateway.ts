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
import { MessageService } from '../service/message.service';
import { ClientsService } from '@dsb-client-gateway/ddhub-client-gateway-clients';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/events',
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
    @Inject(forwardRef(() => MessageService))
    protected readonly messageService: MessageService,
    protected readonly clientsService: ClientsService
  ) {}

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
    client: WebSocket & { request }
  ): Promise<void> {
    const protocol = client.protocol;

    if (protocol !== this.protocol) {
      client.close(1002, 'Protocol Not Supported');

      return;
    }

    const _clientId = new URLSearchParams(client.request.url.split('?')[1]).get(
      'clientId'
    );

    if (_clientId === null) {
      client.close(
        1003,
        "Required paramater 'clientId' ex. ws://localhost:3333/events?clientId=id_name"
      );
      return;
    }

    const clientIdRegex = new RegExp(/^[a-zA-Z0-9\-:]+$/);
    if (!clientIdRegex.test(_clientId)) {
      client.close(
        1003,
        "Required paramater 'clientId' with format Alphanumeric string"
      );
      return;
    }

    await this.clientsService.attemptCreateClient(_clientId);

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

    this.logger.log(
      `New client connected ${_clientId}, total client connected ${this.server.clients.size}`
    );
  }

  @SubscribeMessage('message')
  public async handleMessage(
    @ConnectedSocket() client,
    @MessageBody() data
  ): Promise<void> {
    this.logger.log(
      `${client.request.connection.remoteAddress}:${
        client.request.connection.remotePort
      }${client.request.url} ${JSON.stringify(data)}`
    );
    this.messageService
      .sendMessage(JSON.parse(data))
      .then((response) => {
        client.send(JSON.stringify(response));
      })
      .catch((ex) => {
        this.logger.error(
          `${client.request.connection.remoteAddress}:${
            client.request.connection.remotePort
          }${client.request.url} ${JSON.stringify(ex.response)}`
        );
        client.send(JSON.stringify(ex.response));
      });
  }
}
