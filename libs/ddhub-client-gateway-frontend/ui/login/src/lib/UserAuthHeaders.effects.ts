import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { UserContext } from './UserDataContext';

export const useUserAuthHeaders = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error(
      'useUserAuthHeaders must be used within a UserContext provider'
    );
  }
  const { authEnabled, userAuth, refreshToken } = userContext;
  const [requestInterceptorId, setRequestInterceptorId] = useState<number>();

  const resetRequestInterceptor = () => {
    if (requestInterceptorId !== undefined) {
      Axios.interceptors.request.eject(requestInterceptorId);
      setRequestInterceptorId(undefined);
    }
  };

  const encodeParams = (params: Record<string, string>) => {
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  };

  useEffect(() => {
    if (!authEnabled || !userAuth || !userAuth.authenticated) {
      resetRequestInterceptor();
      return;
    }

    if (
      userAuth.authenticated &&
      userAuth.accessToken &&
      requestInterceptorId === undefined
    ) {
      const accessToken =
        userAuth.accessToken ?? localStorage.getItem('accessToken');
      const interceptorId = Axios.interceptors.request.use((config) => {
        return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        };
      });
      setRequestInterceptorId(interceptorId);
    }

    // Encode query params
    Axios.interceptors.request.use((config) => {
      if (config.params) {
        config.url += (config.url?.includes('?') ? '&' : '?') + encodeParams(config.params);
        delete config.params;
      }
      return config;
    });

    const responseInterceptorId = Axios.interceptors.response.use(
      undefined,
      async (err) => {
        const originalRequest = err.config;
        if (
          (err.response.status === 401 || err.response.status === 403) &&
          !originalRequest._retry
        ) {
          await refreshToken();
          originalRequest._retry = true;
          return Axios(originalRequest);
        }
        return Promise.reject(err);
      }
    );

    return () => {
      if (requestInterceptorId) {
        Axios.interceptors.request.eject(requestInterceptorId);
      }
      Axios.interceptors.response.eject(responseInterceptorId);
    };
  }, [authEnabled, userAuth]);
};
