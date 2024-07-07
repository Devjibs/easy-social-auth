import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';

export abstract class AuthStrategy {
  constructor(
    protected readonly clientId: string,
    protected readonly clientSecret: string,
    protected readonly redirectUri: string,
    protected readonly userInfoEndpoint: string,
    protected readonly tokenEndpoint: string,
    protected readonly authUrl: string,
    protected readonly grantType: string = 'authorization_code'
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

  async exchangeCodeForToken(code: string, additionalParams: Record<string, string> = {}): Promise<string> {
    try {
      const { data } = await axios.post(this.tokenEndpoint, {
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: this.grantType,
        ...additionalParams,
      });
      return data.access_token;
    } catch (error: any) {
      throw new Error(`Failed to exchange code for token: ${error.response?.data?.error_description || error.message}`);
    }
  }

  abstract getUserData(accessToken: string, accessTokenSecret?: string): Promise<ISocialUser>;

  validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
