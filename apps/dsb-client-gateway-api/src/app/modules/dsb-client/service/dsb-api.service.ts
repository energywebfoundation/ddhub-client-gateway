import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Agent } from 'https';
import { TlsAgentService } from './tls-agent.service';
import { EthersService } from '../../utils/service/ethers.service';
import { IamService } from '../../iam-service/service/iam.service';
import { lastValueFrom } from 'rxjs';
import {
  Channel,
  Message,
  SendMessageData,
  SendMessageResult,
  TopicData,
  TopicDataResponse,
  TopicVersionResponse,
} from '../dsb-client.interface';
import { SecretsEngineService } from '../../secrets-engine/secrets-engine.interface';
import { v4 as uuidv4 } from 'uuid';
import promiseRetry from 'promise-retry';
import FormData from 'form-data';
import { EnrolmentRepository } from '../../storage/repository/enrolment.repository';
import { DidAuthService } from '../module/did-auth/service/did-auth.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import * as qs from 'qs';
import 'multer';

@Injectable()
export class DsbApiService implements OnModuleInit {
  private readonly logger = new Logger(DsbApiService.name);

  protected tls: Agent | null;
  protected baseUrl: string;

  public async onModuleInit(): Promise<void> {
    await this.login().catch((e) => {
      this.logger.error(`Login failed`, e);
    });
  }

  constructor(
    protected readonly configService: ConfigService,
    protected readonly httpService: HttpService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly ethersService: EthersService,
    protected readonly enrolmentRepository: EnrolmentRepository,
    protected readonly iamService: IamService,
    protected readonly secretsEngineService: SecretsEngineService,
    protected readonly didAuthService: DidAuthService,
    protected readonly schedulerRegistry: SchedulerRegistry
  ) {
    this.baseUrl = this.configService.get<string>(
      'DSB_BASE_URL',
      'https://dsb-dev.energyweb.org'
    );
  }

  public async getDIDsFromRoles(
    roles: string[],
    searchType: 'ANY'
  ): Promise<string[]> {
    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get(this.baseUrl + '/role/list', {
          params: {
            roles,
            searchType,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return data.dids;
  }

  public async getTopicVersions(
    topicId: string
  ): Promise<TopicVersionResponse> {
    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get(this.baseUrl + `/topic/${topicId}/version`, {
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    console.log(data);

    return data;
  }

  public async checkIfDIDHasRoles(
    did: string,
    roles: string[]
  ): Promise<boolean> {
    const { data } = await promiseRetry(async (retry, attempt) => {
      console.log(this.didAuthService.getToken());
      return lastValueFrom(
        this.httpService.get(this.baseUrl + '/role/check', {
          params: {
            did,
            roles,
          },
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return data;
  }

  public async uploadFile(
    file: Express.Multer.File,
    fileName: string,
    fqcn: string,
    signature: string,
    topicId: string
  ): Promise<void> {
    try {
      const formData = new FormData();

      formData.append('file', file.buffer);
      formData.append('fileName', fileName);
      formData.append('fqcn', fqcn);
      formData.append('signature', signature);
      formData.append('topicId', topicId);
      formData.append('topicVersion', '1.0.0');

      const { data } = await promiseRetry(async (retry, attempt) => {
        return lastValueFrom(
          this.httpService.post(
            'https://aemovc.eastus.cloudapp.azure.com/message/upload',
            formData,
            {
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
              httpsAgent: this.getTLS(),
              headers: {
                Authorization: `Bearer ${this.didAuthService.getToken()}`,
                ...formData.getHeaders(),
              },
            }
          )
        ).catch((err) => this.handleRequestWithRetry(err, retry));
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  public async getTopicsByOwnerAndName(
    name: string,
    owner: string
  ): Promise<TopicDataResponse> {
    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get('http://localhost:8080/topic', {
          params: {
            owner,
            name,
          },
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return data;
  }

  public async getTopics(ownerDID?: string): Promise<TopicData[]> {
    if (!ownerDID) {
      const enrolment = this.enrolmentRepository.getEnrolment();

      if (!enrolment) {
        return [];
      }

      ownerDID = enrolment.did;
    }

    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get('https://aemovc.eastus.cloudapp.azure.com/topic', {
          params: {
            owner: ownerDID,
          },
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return data;
  }

  public async getMessages(
    fqcn: string,
    from?: string,
    clientId?: string,
    amount?: number
  ): Promise<Message[]> {
    try {
      const { data } = await promiseRetry(async (retry, attempt) => {
        return lastValueFrom(
          this.httpService.get(this.baseUrl + '/message', {
            httpsAgent: this.getTLS(),
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
        ).catch((err) => this.handleRequestWithRetry(err, retry));
      });

      return data;
    } catch (e) {
      this.logger.error(e);

      return [];
    }
  }

  public async sendMessage(
    fqcn: string,
    topic: string,
    payload: object
  ): Promise<SendMessageResult> {
    const signature = 'asd';
    const transactionId: string = uuidv4();

    const messageData: SendMessageData = {
      topic,
      fqcn,
      payload: JSON.stringify(payload),
      transactionId,
      signature,
    };

    const requestData = this.translateIdempotencyKey(messageData, true);

    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.post(this.baseUrl + '/message', requestData, {
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return {
      id: data,
    };
  }

  protected async handleRequestWithRetry(e, retry): Promise<any> {
    if (!e.response) {
      this.logger.error(e);

      return;
    }

    const { status } = e.response;

    this.logger.error(e);
    this.logger.error(e.response.data);

    if (status === HttpStatus.UNAUTHORIZED) {
      this.logger.log('Unauthorized, attempting to login');

      await this.login();

      return retry();
    }

    if (status === HttpStatus.FORBIDDEN) {
      this.logger.error(`Request forbidden`);

      throw new Error();
    }

    return retry();
  }

  public async getChannels(): Promise<Channel[]> {
    await this.enableTLS();

    const { data } = await promiseRetry(async (retry, attempt) => {
      return lastValueFrom(
        this.httpService.get(this.baseUrl + '/channel/pubsub', {
          httpsAgent: this.getTLS(),
          headers: {
            Authorization: `Bearer ${this.didAuthService.getToken()}`,
          },
        })
      ).catch((err) => this.handleRequestWithRetry(err, retry));
    });

    return data;
  }

  public async login(): Promise<void> {
    this.logger.log('Attempting to login to DID Auth Server');

    const privateKey: string | null =
      await this.secretsEngineService.getPrivateKey();

    if (!privateKey) {
      this.logger.error('Private key is missing');

      return;
    }

    await this.didAuthService.login(
      privateKey,
      this.iamService.getDIDAddress()
    );

    this.logger.log('Login successful, attempting to init ext channel');

    await this.initExtChannel();
  }

  public async health(): Promise<{ statusCode: number; message?: string }> {
    await this.enableTLS();

    try {
      await this.httpService.get('/health', {
        httpsAgent: this.getTLS(),
      });

      return { statusCode: 200 };
    } catch (e) {
      if (e.response) {
        this.logger.error(`DSB Health failed - ${e.response.data}`);
      }

      return {
        statusCode: e.response.status,
        message: e.response.data,
      };
    }
  }

  protected translateIdempotencyKey(
    body: { transactionId?: string; correlationId?: string },
    outgoing: boolean
  ): any {
    if (outgoing) {
      const correlationId = body.transactionId;
      delete body.transactionId;
      return {
        ...body,
        correlationId,
      };
    } else {
      const transactionId = body.correlationId;
      delete body.correlationId;
      return {
        ...body,
        transactionId,
      };
    }
  }

  protected async initExtChannel(): Promise<void> {
    try {
      const { data } = await promiseRetry(async (retry, attempt) => {
        return lastValueFrom(
          this.httpService.post(
            'https://aemovc.eastus.cloudapp.azure.com/channel/initExtChannel',
            {
              httpsAgent: this.getTLS(),
            },
            {
              headers: {
                ...this.getAuthHeader(),
              },
            }
          )
        ).catch((err) => this.handleRequestWithRetry(err, retry));
      });

      this.logger.log('Init ext channel successful');

      return data;
    } catch (e) {
      this.logger.error(e);

      if (e.response) {
        this.logger.error(e.response.data);
      }
    }
  }

  protected getAuthHeader(): { Authorization: string } {
    return {
      Authorization: `Bearer ${this.didAuthService.getToken()}`,
    };
  }

  protected getTLS(): Agent | null {
    return this.tls;
  }

  protected async enableTLS(): Promise<void> {
    this.tls = await this.tlsAgentService.create();
  }

  protected disableTLS(): void {
    this.tls.destroy();

    this.tls = null;
  }
}
