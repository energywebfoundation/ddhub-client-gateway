import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Role, RoleStatus } from '@ddhub-client-gateway/identity/models';
import { AccountStatusEnum } from './check-account-status/CheckAccountStatus.effects';
import { RouteRestrictions } from './config/route-restrictions.interface';
import { DefaultOptions, MutationFunction, QueryClient } from 'react-query';
import {
  GatewayResponseDto,
  RefreshTokenRequestDto,
  getGatewayControllerGetQueryKey,
  loginControllerRefreshToken,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useRouter } from 'next/router';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

const queryClientOptions: DefaultOptions = {
  queries: {
    retry: false,
    refetchOnWindowFocus: false,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

export enum UserRole {
  ADMIN = 'admin',
  MESSAGING = 'messaging',
}

export interface UserDataContext {
  accountStatus: AccountStatusEnum | RoleStatus;
  isChecking: boolean;
  errorMessage: string;
  routeRestrictions: RouteRestrictions;
  displayedRoutes: Set<string>;
  roles: Role[];
  did?: string;
}

export interface UserAuthContext {
  username: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  isChecking: boolean;
  errorMessage?: string;
  authenticated: boolean;
}

const initialUserData = {
  accountStatus: AccountStatusEnum.NO_PRIVATE_KEY,
  isChecking: false,
  errorMessage: '',
  roles: [],
  displayedRoutes: new Set<string>(),
  routeRestrictions: new RouteRestrictions(),
};

const initialUserAuthData = {
  username: '',
  role: '',
  accessToken: '',
  refreshToken: '',
  isChecking: false,
  displayedRoutes: new Set<string>(),
  authenticated: false,
};

interface UserContext {
  userData: UserDataContext;
  userAuth: UserAuthContext;
  setUserData: Dispatch<SetStateAction<UserDataContext>>;
  setUserAuth: Dispatch<SetStateAction<UserAuthContext>>;
  resetUserData: (withErrorMessage?: string) => Promise<boolean>;
  resetAuthData: (withErrorMessage?: string) => Promise<boolean>;
  refreshIdentity: boolean;
  setRefreshIdentity: Dispatch<SetStateAction<boolean>>;
  authenticated: boolean;
  refreshToken: () => Promise<void>;
  authEnabled?: boolean;
}

export const UserContext = createContext<UserContext | undefined>(undefined);

export const useUserData = (queryClient: QueryClient) => {
  const router = useRouter();
  const [config, setConfig] = useState<GatewayResponseDto | undefined>(
    undefined,
  );
  const [userData, setUserData] = useState<UserDataContext>(initialUserData);
  const [userAuth, setUserAuth] =
    useState<UserAuthContext>(initialUserAuthData);
  const [refreshIdentity, setRefreshIdentity] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const resetUserData = (withErrorMessage?: string) => {
    setRefreshIdentity(false);
    setUserData({ ...initialUserData, errorMessage: withErrorMessage ?? '' });
    return router.push(routerConst.InitialPage);
  };

  const resetAuthData = (withErrorMessage?: string) => {
    resetTokenStorage();
    setUserAuth({
      ...initialUserAuthData,
      errorMessage: withErrorMessage ?? '',
    });
    setAuthenticated(false);
    setRefreshIdentity(false);
    return router.push(routerConst.InitialPage);
  };

  const userDataValue = useMemo(() => ({ userData, setUserData }), [userData]);
  const userAuthValue = useMemo(() => ({ userAuth, setUserAuth }), [userAuth]);
  const refreshIdentityValue = useMemo(
    () => ({ refreshIdentity, setRefreshIdentity }),
    [refreshIdentity],
  );
  const authenticatedValue = useMemo(
    () => ({ authenticated, setAuthenticated }),
    [authenticated],
  );

  useEffect(() => {
    fetchGatewayConfig().then((res) => {
      setConfig(res);
    });
  }, []);

  useEffect(() => {
    if (config) {
      if (userAuth.authenticated) {
        setAuthenticated(true);
      } else {
        if (config.authEnabled) {
          refreshToken();
        } else {
          setAuthenticated(true);
          setRefreshIdentity(true);
          queryClient.setDefaultOptions({
            queries: {
              ...queryClientOptions.queries,
              enabled: authenticated,
            },
          });
        }
      }
    }
  }, [config]);

  useEffect(() => {
    if (userAuth && userAuth.authenticated) {
      updateTokenStorage(userAuth);
      setRefreshIdentity(true);
      setAuthenticated(true);
    }
  }, [userAuth]);

  useEffect(() => {
    queryClient.setDefaultOptions({
      queries: {
        ...queryClientOptions.queries,
        enabled: authenticated,
      },
    });
  }, [authenticated]);

  const fetchGatewayConfig = async () => {
    return await queryClient.fetchQuery<GatewayResponseDto>(
      getGatewayControllerGetQueryKey(),
    );
  };

  const refreshToken = async () => {
    if (!config?.authEnabled) {
      setAuthenticated(true);
      return;
    }

    setAuthenticated(false);
    const token = localStorage.getItem('refreshToken');
    if (!token) {
      await resetAuthData('No refresh token found');
      return;
    }

    const mutationFn: MutationFunction<
      AsyncReturnType<typeof loginControllerRefreshToken>,
      { data: RefreshTokenRequestDto }
    > = (props) => {
      const { data } = props || {};
      return loginControllerRefreshToken(data);
    };

    try {
      const response = await queryClient.executeMutation({
        mutationFn: mutationFn,
        variables: { data: { refreshToken: token } },
      });

      const { accessToken, refreshToken, username, role } = response;
      setUserAuth((prevValue) => ({
        ...prevValue,
        username,
        role,
        accessToken,
        refreshToken,
        isChecking: false,
        authenticated: true,
      }));
      setAuthenticated(true);
    } catch (error: any) {
      console.error(error);
      setAuthenticated(false);
      await resetAuthData(error.message);
    }
  };

  const updateTokenStorage = ({
    accessToken,
    refreshToken,
    username,
    role,
  }: UserAuthContext) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
  };

  const resetTokenStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

  return {
    userDataValue,
    setUserData,
    userAuthValue,
    setUserAuth,
    resetUserData,
    resetAuthData,
    refreshIdentityValue,
    setRefreshIdentity,
    authenticatedValue,
    setAuthenticated,
    refreshToken,
    authEnabled: config?.authEnabled,
  };
};
