export interface DidAuthResponse {
  access_token: string;
  type: 'Bearer';
  expires_in: number;
  refresh_token: string;
}
