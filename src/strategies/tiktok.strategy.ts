import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';
import { ITiktokConfig } from '../interfaces/config.interface';
import { SocialAuthResponse } from '../interfaces/easy-social-auth-response.interface';
import { AuthStrategy } from './easy-social-auth.strategy';

export class TiktokStrategy extends AuthStrategy {
  constructor(private config: ITiktokConfig) {
    super(
      config.clientId,
      config.clientSecret,
      config.userInfoEndpoint,
      config.tokenEndpoint,
      config.authUrl
    );
  }

  generateAuthUrl(redirectUri: string, scope?: string): string {
    const url = new URL(this.authUrl);
    url.searchParams.set('client_key', this.clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    if (scope) url.searchParams.set('scope', scope);
    return url.toString();
  }

  async getUserData(accessToken: string): Promise<SocialAuthResponse<any>> {
    try {
      const { data } = await axios.get(this.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (data) return {
        status: true,
        data: data
      };

      return { status: false, error: "unable to retrieve user data" };
    } catch (error: any) {
      return { status: false, error: error.response?.data?.error_description || error.message };
    }
  }
}
