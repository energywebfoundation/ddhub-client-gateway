import { useContext, useEffect } from 'react';
import { UserContext } from './UserDataContext';
import Axios from 'axios';

export const useUserAuthHeaders = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error(
      'useUserAuthHeaders must be used within a UserContext provider'
    );
  }

  useEffect(() => {
    if (!userContext.userAuth) {
      return;
    }

    let requestInterceptorId: number | undefined;
    if (
      userContext.userAuth.authenticated &&
      userContext.userAuth.accessToken
    ) {
      const accessToken =
        userContext.userAuth.accessToken ?? localStorage.getItem('accessToken');
      requestInterceptorId = Axios.interceptors.request.use((config) => {
        return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        };
      });
    }

    const responseInterceptorId = Axios.interceptors.response.use(
      undefined,
      async (err) => {
        const originalRequest = err.config;
        if (
          (err.response.status === 401 || err.response.status === 403) &&
          !originalRequest._retry
        ) {
          await userContext.refreshToken();
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
  }, [userContext.userAuth]);
};
