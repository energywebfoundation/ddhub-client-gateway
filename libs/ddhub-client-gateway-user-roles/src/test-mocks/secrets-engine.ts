export interface UserDetails {
  password: string;
  role: string;
}

export class SecretsEngineService {
  isAuthEnabled(): boolean {
    return false;
  }

  async getUserAuthDetails(): Promise<UserDetails | string | null> {
    return null;
  }
}
