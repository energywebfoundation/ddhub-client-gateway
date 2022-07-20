import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';

export const useErrorHandler = (httpService: HttpService, logger: Logger) => {
  httpService.axiosRef.interceptors.response.use(
    (res: AxiosResponse) => {
      return res;
    },
    (err) => {
      const errorObject = {
        method: err.config.method,
        status: err.response.status,
        url: err.config.url,
        message: err.message,
        params: err.config.params,
        body: err.config.data,
        responseBody: err.response.data,
        httpsAgent: !!err.config.httpsAgent,
      };

      logger.debug(JSON.stringify(errorObject));

      return Promise.reject(err);
    }
  );
};
