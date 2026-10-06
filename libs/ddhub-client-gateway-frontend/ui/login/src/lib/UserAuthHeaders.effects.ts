import { useContext, useEffect, useRef } from 'react';
import Axios from 'axios';
import { UserContext } from './UserDataContext';

let refreshPromise: Promise<string | null> | null = null;

interface HeaderRecord {
  set?: (name: string, value: string) => void;
  [key: string]: unknown;
}

const setHeader = (
  headers: HeaderRecord | undefined,
  name: string,
  value: string,
) => {
  if (headers && typeof headers.set === 'function') {
    headers.set(name, value);
  } else if (headers) {
    headers[name] = value;
  }
};

const encodeParams = (params: Record<string, string>) => {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');
};

export const useUserAuthHeaders = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error(
      'useUserAuthHeaders must be used within a UserContext provider',
    );
  }
  const { authEnabled, userAuth, refreshToken, resetAuthData, resetUserData } =
    userContext;

  const refreshTokenRef = useRef(refreshToken);
  refreshTokenRef.current = refreshToken;
  const resetAuthDataRef = useRef(resetAuthData);
  resetAuthDataRef.current = resetAuthData;
  const resetUserDataRef = useRef(resetUserData);
  resetUserDataRef.current = resetUserData;
  const authEnabledRef = useRef(authEnabled);
  authEnabledRef.current = authEnabled;
  const userAuthRef = useRef(userAuth);
  userAuthRef.current = userAuth;

  useEffect(() => {
    const requestInterceptorId = Axios.interceptors.request.use((config) => {
      if (authEnabledRef.current && userAuthRef.current?.authenticated) {
        const accessToken =
          localStorage.getItem('accessToken') ||
          userAuthRef.current?.accessToken;
        if (accessToken && config.headers) {
          setHeader(config.headers as HeaderRecord, 'Authorization', `Bearer ${accessToken}`);
        }
      }

      // Encode query params
      if (
        config.method === 'get' &&
        config.params &&
        typeof config.params === 'object'
      ) {
        const queryString = encodeParams(config.params);
        config.url += (config.url?.includes('?') ? '&' : '?') + queryString;
        delete config.params; // prevent axios from re-attaching unencoded params
      }

      return config;
    });

    const responseInterceptorId = Axios.interceptors.response.use(
      undefined,
      async (err) => {
        const originalRequest = err?.config;
        if (!originalRequest) {
          return Promise.reject(err);
        }

        const isAuthUrl =
          originalRequest.url?.includes('/login/refresh-token') ||
          originalRequest.url?.includes('/login');

        const status = err?.response?.status;

        if (authEnabledRef.current && (status === 401 || status === 403)) {
          if (isAuthUrl) {
            // Do not retry auth endpoints on 401/403
            if (originalRequest.url?.includes('/login/refresh-token')) {
              await resetAuthDataRef.current('Session expired');
              await resetUserDataRef.current();
            }
            return Promise.reject(err);
          }

          if (originalRequest._retry) {
            await resetAuthDataRef.current('Session expired');
            await resetUserDataRef.current();
            return Promise.reject(err);
          }

          originalRequest._retry = true;

          try {
            if (!refreshPromise) {
              refreshPromise = (async () => {
                try {
                  await refreshTokenRef.current();
                  const token =
                    localStorage.getItem('accessToken') ||
                    null;
                  return token;
                } finally {
                  refreshPromise = null;
                }
              })();
            }

            const newToken = await refreshPromise;
            if (newToken && originalRequest.headers) {
              setHeader(
                originalRequest.headers as HeaderRecord,
                'Authorization',
                `Bearer ${newToken}`,
              );
              return Axios(originalRequest);
            }
          } catch (refreshErr) {
            return Promise.reject(refreshErr);
          }
        }

        return Promise.reject(err);
      },
    );

    return () => {
      Axios.interceptors.request.eject(requestInterceptorId);
      Axios.interceptors.response.eject(responseInterceptorId);
      delete Axios.defaults.headers.common['Authorization'];
    };
  }, []);
};
