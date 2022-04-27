import { createServer } from 'miragejs';
import {
  getApplicationsControllerGetApplicationsMock,
  getIdentityControllerGetMock,
  getTopicsControllerGetTopicsHistoryByIdMock,
  getTopicsControllerGetTopicsMock,
  getTopicsControllerGetTopicHistoryByIdAndVersionMock,
  getChannelControllerGetByTypeMock,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export function makeServer({ environment = 'development' }) {
  return createServer({
    environment,
    routes() {
      this.passthrough('/_next/static/development/_devPagesManifest.json');
      this.passthrough('/_next/static/development/_devMiddlewareManifest.json');
      this.namespace = 'api/v2';
      this.urlPrefix = 'http://localhost:3333';

      this.get('/applications', () => {
        return getApplicationsControllerGetApplicationsMock();
      });

      this.get('/identity', () => {
        return getIdentityControllerGetMock();
      });

      this.get('/topics', () => {
        return getTopicsControllerGetTopicsMock();
      });

      this.get('/channels', () => {
        return getChannelControllerGetByTypeMock();
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
    },
  });
}
