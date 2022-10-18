import { createServer } from 'miragejs';
import {
  getApplicationsControllerGetApplicationsMock,
  getIdentityControllerGetMock,
  getTopicsControllerGetTopicsHistoryByIdMock,
  getTopicsControllerGetTopicsMock,
  getTopicsControllerGetTopicHistoryByIdAndVersionMock,
  getChannelControllerGetByTypeMock,
  getChannelControllerGetMock,
  getChannelMessagesMock,
  getDownloadMessageMock,
  getFrontendConfigMock,
  getTopicsControllerGetTopicsSearchMock,
  getCronMock,
  getGatewayMock,
  getClientsMock,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export function makeServer({ environment = 'development' }) {
  return createServer({
    environment,
    routes() {
      this.passthrough('/_next/static/development/_devPagesManifest.json');
      this.passthrough('/_next/static/development/_devMiddlewareManifest.json');
      this.get('/frontend-config.json', () => {
        return getFrontendConfigMock();
      });

      this.namespace = 'api/v2';
      this.urlPrefix = 'http://localhost:3333';

      this.get('/gateway', () => {
        return getGatewayMock();
      });

      this.get('/applications', () => {
        return getApplicationsControllerGetApplicationsMock();
      });

      this.get('/identity', () => {
        return getIdentityControllerGetMock();
      });

      this.get('/topics', (_schema, request) => {
        return getTopicsControllerGetTopicsMock(request.queryParams);
      });

      this.post('/identity', () => {
        return getIdentityControllerGetMock();
      });

      this.get('/channels', () => {
        return getChannelControllerGetByTypeMock();
      });

      this.get('/channels/:fqcn', () => {
        return getChannelControllerGetMock();
      });

      this.put('/channels/:fqcn', (_schema, request) => {
        return { channel: JSON.parse(request.requestBody) };
      });

      this.delete('/channels/:fqcn', () => {
        return {};
      });

      this.post('/topics', (_schema, request) => {
        return { topic: JSON.parse(request.requestBody) };
      });

      this.get('/topics/search', (_schema, request) => {
        return getTopicsControllerGetTopicsSearchMock(request.queryParams);
      });

      this.get('/topics/:id/versions', (_schema, request) => {
        return getTopicsControllerGetTopicsHistoryByIdMock(request.queryParams);
      });

      this.put('/topics/:id', (_schema, request) => {
        return { topic: JSON.parse(request.requestBody) };
      });

      this.delete('/topics/:id', () => {
        return {};
      });

      this.get('topics/:id/versions/:version', () => {
        return getTopicsControllerGetTopicHistoryByIdAndVersionMock();
      });

      this.put('topics/:id/versions/:version', (_schema, request) => {
        return { topic: JSON.parse(request.requestBody) };
      });

      this.delete('topics/:id/versions/:version', () => {
        return {};
      });

      this.post('channels', (_schema, request) => {
        return { channel: JSON.parse(request.requestBody) };
      });

      this.get('messages', () => {
        return getChannelMessagesMock();
      });

      this.get('messages/download', () => {
        return getDownloadMessageMock();
      });

      this.post('messages', () => {
        return {};
      });

      this.post('messages/upload', () => {
        return {};
      });

      this.post('certificate', () => {
        return {};
      });

      this.get('clients', () => {
        return getClientsMock();
      });

      this.delete('clients/:clientId', () => {
        return {};
      });

      this.delete('clients', () => {
        return {};
      });

      this.get('cron', () => {
        return getCronMock();
      })
    },
  });
}
