import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebSocket, WebSocketServer as Server } from 'ws';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebSocketImplementation } from '../message.const';
import { AuthService } from '../../utils/service/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayInit {
  @WebSocketServer()
  public server: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private readonly protocol: string = 'dsb-protocol';

  constructor(
    protected readonly configService: ConfigService,
    protected readonly authService: AuthService
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
    client: WebSocket & { request: any },
    a: any[],
    b: any
  ): Promise<void> {
    const protocol = client.protocol;

    if (protocol !== this.protocol) {
      client.close(1002, 'Protocol Not Supported');

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

  private isAuthorized(socket: WebSocket): boolean {
    return true;
  }
}
