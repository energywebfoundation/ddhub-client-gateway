import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DdhubBaseService } from './ddhub-base.service';
import { RetryConfigService } from '@dsb-client-gateway/ddhub-client-gateway-utils';
import { Span } from 'nestjs-otel';
import { DidAuthService } from '@dsb-client-gateway/ddhub-client-gateway-did-auth';
import { TlsAgentService } from './tls-agent.service';
import {
  DeleteTopicResponseDto,
  PostTopicBodyDto,
  Topic,
  TopicCountDto,
  TopicDataResponse,
  TopicVersion,
  TopicVersionResponse,
  UpdateTopicBodyDTO,
  UpdateTopicHistoryDTO,
  UpdateTopicResponeDto,
} from '../dto';
import * as qs from 'qs';
import { DdhubLoginService } from './ddhub-login.service';
import { MessageBrokerErrors } from '../ddhub-client-gateway-message-broker.const';

@Injectable()
export class DdhubTopicsService extends DdhubBaseService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly retryConfigService: RetryConfigService,
    protected readonly didAuthService: DidAuthService,
    protected readonly tlsAgentService: TlsAgentService,
    protected readonly ddhubLoginService: DdhubLoginService
  ) {
    super(
      new Logger(DdhubTopicsService.name),
      retryConfigService,
      ddhubLoginService
    );
  }

  @Span('ddhub_mb_getTopicById')
  async getTopicById(topicId: string): Promise<TopicVersion | null> {
    try {
      const { data } = await this.request<TopicVersion | null>(
        () =>
          this.httpService.get('/topics/' + topicId + '/versions', {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );
      this.logger.error(`Get topic with topicId: ${topicId} successful`);

      return data;
    } catch (e) {
      this.logger.error(`Get topic with topicId: ${topicId} failed`, e);

      return null;
    }
  }

  @Span('ddhub_mb_deleteTopic')
  public async deleteTopic(id: string): Promise<DeleteTopicResponseDto> {
    try {
      this.logger.log('topic to be deleted', id);
      const result = await this.request<DeleteTopicResponseDto>(
        () =>
          this.httpService.delete(`/topics/${id}`, {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );

      this.logger.log(`delete topic successful with id:${id}`);

      return result.data;
    } catch (e) {
      this.logger.error(`delete topic failed with id:${id}`, e);
      throw e;
    }
  }

  @Span('ddhub_mb_deleteTopicByVersion')
  public async deleteTopicByVersion(
    id: string,
    version: string
  ): Promise<DeleteTopicResponseDto> {
    try {
      this.logger.log(
        `topic to be deleted with version: ${version} and id:${id}`
      );
      const { data } = await this.request<DeleteTopicResponseDto>(
        () =>
          this.httpService.delete(`/topics/${id}/versions/${version}`, {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );

      this.logger.log(
        `delete topic successful with version: ${version} and id:${id}`
      );

      return data;
    } catch (e) {
      this.logger.error(
        `delete topic with id ${id} and version ${version} failed`,
        e
      );
      throw e;
    }
  }

  @Span('ddhub_mb_updateTopicByIdAndVersion')
  public async updateTopicByIdAndVersion(
    topicData: UpdateTopicHistoryDTO,
    id: string,
    versionNumber: string
  ): Promise<Topic> {
    try {
      this.logger.log('topic data to be updated', topicData);
      const result = await this.request<Topic>(
        () =>
          this.httpService.put(
            `/topics/${id}/versions/${versionNumber}`,
            topicData,
            {
              httpsAgent: this.tlsAgentService.get(),
              headers: {
                Authorization: `Bearer ${this.didAuthService.getToken()}`,
              },
            }
          ),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );

      this.logger.log(
        `update topics successful with id: ${id} and versionNumber:${versionNumber}`
      );

      return result.data;
    } catch (e) {
      this.logger.error(
        `update topics failed with id: ${id} and versionNumber:${versionNumber}`,
        e
      );
      throw e;
    }
  }

  @Span('ddhub_mb_updateTopics')
  public async updateTopic(
    data: UpdateTopicBodyDTO,
    id: string
  ): Promise<UpdateTopicResponeDto> {
    try {
      this.logger.log('topic to be updated', data);
      const result = await this.request<UpdateTopicResponeDto>(
        () =>
          this.httpService.put(`/topics/${id}`, data, {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );

      this.logger.log(`update topics successful with id: ${id}`);

      return result.data;
    } catch (e) {
      this.logger.error(`update topics failed with id: ${id}`, e);
      throw e;
    }
  }

  @Span('ddhub_mb_postTopics')
  public async postTopics(topicData: PostTopicBodyDto): Promise<Topic> {
    try {
      const { data } = await this.request<null>(
        () =>
          this.httpService.post('/topics', topicData, {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );

      this.logger.log('post topics successful', data);

      return data;
    } catch (e) {
      this.logger.error('post topics failed', e);
      throw e;
    }
  }

  @Span('ddhub_mb_getTopicHistoryByIdAndVersion')
  public async getTopicHistoryByIdAndVersion(
    id: string,
    versionNumber: string
  ): Promise<Topic> {
    try {
      const { data } = await this.request<Topic>(
        () =>
          this.httpService.get(`/topics/${id}/versions/${versionNumber}`, {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );

      this.logger.log(
        `get topics history with id:${id} and version: ${versionNumber} successful`
      );
      return data;
    } catch (e) {
      this.logger.error(
        `get topics history with id:${id} and version: ${versionNumber} failed`,
        e
      );
      throw e;
    }
  }

  @Span('ddhub_mb_getTopicHistoryById')
  public async getTopicHistoryById(id: string): Promise<TopicDataResponse> {
    try {
      const { data } = await this.request<TopicDataResponse>(
        () =>
          this.httpService.get(`/topics/${id}/versions`, {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );

      this.logger.log(`get topics history with id:${id} successful`);
      return data;
    } catch (e) {
      this.logger.error(`get topics history with id:${id} failed`, e);
      throw e;
    }
  }

  @Span('ddhub_mb_getTopicsBySearch')
  public async getTopicsBySearch(
    keyword: string,
    limit?: number,
    page?: number
  ): Promise<TopicDataResponse | []> {
    if (!keyword) {
      this.logger.debug(`no keyword given so returning empty array`);
      return [];
    }

    try {
      const result = await this.request<TopicDataResponse>(
        () =>
          this.httpService.get('/topics/search', {
            params: {
              keyword,
              limit,
              page,
            },
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );

      this.logger.log(`get topics search with keyword: ${keyword} successful`);
      return result.data;
    } catch (e) {
      this.logger.error(`get topics search with keyword: ${keyword} failed`, e);
      throw e;
    }
  }

  @Span('ddhub_mb_getTopicsCountByOwner')
  public async getTopicsCountByOwner(
    owners: string[]
  ): Promise<TopicCountDto[]> {
    if (!owners || owners.length === 0) {
      return [];
    }

    try {
      const result = await this.request<TopicCountDto[]>(
        () =>
          this.httpService.get('/topics/count', {
            params: {
              owner: owners,
            },
            paramsSerializer: function (params) {
              return qs.stringify(params, { arrayFormat: 'repeat' });
            },
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );

      this.logger.log(`get topics count with owners: ${owners} successful`);
      return result.data;
    } catch (e) {
      this.logger.error(`get topics count with owners: ${owners} failed`, e);
      throw e;
    }
  }

  @Span('ddhub_mb_getTopicVersions')
  public async getTopicVersions(
    topicId: string
  ): Promise<TopicVersionResponse> {
    try {
      const result = await this.request<null>(
        () =>
          this.httpService.get(`/topics/${topicId}/versions`, {
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );

      return result.data;
    } catch (e) {
      this.logger.error(`get topic versions failed for ${topicId}`, e);
      throw e;
    }
  }

  @Span('ddhub_mb_getTopics')
  public async getTopics(
    limit: number,
    name: string,
    applicationNameSpace: string,
    page: number,
    tags: string[]
  ): Promise<TopicDataResponse> {
    //replacing double quotes in order to pass correct input to MB
    const owner = applicationNameSpace.replace(/"/g, '');

    try {
      const { data } = await this.request<TopicDataResponse>(
        () =>
          this.httpService.get('/topics', {
            params: {
              limit,
              name,
              owner,
              page,
              tags,
            },
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );

      this.logger.log(`get topics with owner:${owner} successful`);
      return data;
    } catch (e) {
      this.logger.error(`get topics with owner:${owner} failed`, e);
      throw e;
    }
  }

  @Span('ddhub_mb_getTopicsByOwnerAndName')
  public async getTopicsByOwnerAndName(
    name: string,
    owner: string
  ): Promise<TopicDataResponse> {
    try {
      const { data } = await this.request<TopicDataResponse>(
        () =>
          this.httpService.get('/topics', {
            params: {
              owner,
              name,
            },
            httpsAgent: this.tlsAgentService.get(),
            headers: {
              Authorization: `Bearer ${this.didAuthService.getToken()}`,
            },
          }),
        {
          stopOnResponseCodes: [MessageBrokerErrors.UNAUTHORIZED_ACCESS],
        }
      );

      return data;
    } catch (e) {
      this.logger.log(
        `get topics with owner: ${owner} and name: ${name} failed`
      );

      throw e;
    }
  }
}
