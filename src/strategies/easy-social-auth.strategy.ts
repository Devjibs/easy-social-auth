import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';
import { GrantType } from '../enums/grant-type.enum';
import { SocialAuthResponse } from '../interfaces/easy-social-auth-response.interface';

export abstract class AuthStrategy {
  constructor(
    protected readonly clientId: string,
    protected readonly clientSecret: string,
    protected readonly redirectUri: string,
    protected readonly userInfoEndpoint: string,
    protected readonly tokenEndpoint: string,
    protected readonly authUrl: string,
    protected readonly grantType: GrantType = GrantType.AUTHORIZATION_CODE
  ) {}

  generateAuthUrl(state?: string, scope?: string): string {
    const url = new URL(this.authUrl);
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', this.redirectUri);
    url.searchParams.set('response_type', 'code');
    if (state) url.searchParams.set('state', state);
    if (scope) url.searchParams.set('scope', scope);
    return url.toString();
  }

  async exchangeCodeForToken(code: string, additionalParams: Record<string, string> = {}): Promise<SocialAuthResponse<string>> {
    try {
      const { data } = await axios.post(this.tokenEndpoint, {
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: this.grantType,
        ...additionalParams,
      });
      return { status: true, data: data.access_token };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<SocialAuthResponse<string>> {
    try {
      const { data } = await axios.post(this.tokenEndpoint, {
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: GrantType.REFRESH_TOKEN,
      });
      return { status: true, data: data.access_token };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }

  async exchangePasswordForToken(username: string, password: string): Promise<SocialAuthResponse<string>> {
    try {
      const { data } = await axios.post(this.tokenEndpoint, {
        username,
        password,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: GrantType.PASSWORD,
      });
      return { status: true, data: data.access_token };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }

  abstract getUserData(accessToken: string): Promise<SocialAuthResponse<ISocialUser>>;
}
