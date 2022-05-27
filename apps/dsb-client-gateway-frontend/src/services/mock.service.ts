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

      this.get('/applications', () => {
        return getApplicationsControllerGetApplicationsMock();
      });

      this.get('/identity', () => {
        return getIdentityControllerGetMock();
      });

      this.get('/topics', (schema, request) => {
        return getTopicsControllerGetTopicsMock(request.queryParams);
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

      this.get('/topics/:id/versions', () => {
        return getTopicsControllerGetTopicsHistoryByIdMock();
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
    },
  });
}
