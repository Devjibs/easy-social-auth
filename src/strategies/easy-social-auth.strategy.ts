import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';
import { GrantType } from '../enums/grant-type.enum';
import { SocialAuthResponse } from '../interfaces/easy-social-auth-response.interface';

export abstract class AuthStrategy {
  constructor(
    protected readonly clientId: string,
    protected readonly clientSecret: string,
    protected readonly userInfoEndpoint: string,
    protected readonly tokenEndpoint: string,
    protected readonly authUrl: string,
    protected readonly grantType: GrantType = GrantType.AUTHORIZATION_CODE
  ) {}

  generateAuthUrl(redirectUri: string, scope?: string): string {
    const url = new URL(this.authUrl);
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    if (scope) url.searchParams.set('scope', scope);
    return url.toString();
  }

  protected async exchangeToken(params: Record<string, string>): Promise<SocialAuthResponse<string>> {
    try {
      const { data } = await axios.post(this.tokenEndpoint, params);
      return { status: true, data: data.access_token };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }

  async exchangeCodeForToken(code: string, redirectUri: string, additionalParams: Record<string, string> = {}): Promise<SocialAuthResponse<string>> {
    const params = {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: redirectUri,
      grant_type: this.grantType,
      ...additionalParams,
    };
    return this.exchangeToken(params);
  }

  async refreshAccessToken(refreshToken: string): Promise<SocialAuthResponse<string>> {
    const params = {
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: GrantType.REFRESH_TOKEN,
    };
    return this.exchangeToken(params);
  }

  async exchangePasswordForToken(username: string, password: string): Promise<SocialAuthResponse<string>> {
    const params = {
      username,
      password,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: GrantType.PASSWORD,
    };
    return this.exchangeToken(params);
  }

  abstract getUserData(accessToken: string): Promise<SocialAuthResponse<ISocialUser>>;
}
