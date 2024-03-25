import {
  AxiosRequestConfig,
  AxiosResponse,
} from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { reqIdAccess } from './req-id-access';
import { VersionService } from '@dsb-client-gateway/ddhub-client-gateway-version';

export const useInterceptors = (
  httpService: HttpService,
  logger: Logger,
  versionService: VersionService
) => {
  httpService.axiosRef.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      config.headers['X-Request-Id'] = reqIdAccess();
      config.headers['X-DDHUB-Client-Version'] = versionService.getVersion();

      return config;
    }
  );

  httpService.axiosRef.interceptors.response.use(
    (res: AxiosResponse) => {
      return res;
    },
    (err) => {
      const errorObject = {
        method: err.config?.method,
        code: err?.code,
        status: err.response?.status || err?.status,
        url: `${err.config?.baseURL}${err.config?.url}`,
        message: err.message,
        params: err.config?.params,
        body: err.config?.data,
        responseBody: err.response?.data,
        httpsAgent: !!err.config?.httpsAgent,
      };

      logger.debug(`Intercepted Axios Error: ${JSON.stringify(errorObject)}`);

      return Promise.reject(err);
    }
  );
};
