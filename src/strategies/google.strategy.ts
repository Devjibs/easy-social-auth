import axios from 'axios';
import { ISocialUser } from '../interfaces/social-user.interface';
import { IGoogleConfig } from '../interfaces/config.interface';
import { SocialAuthResponse } from '../interfaces/easy-social-auth-response.interface';
import { AuthStrategy } from './easy-social-auth.strategy';

export class GoogleStrategy extends AuthStrategy {
  private revokeTokenUrl: string;

  constructor(config: IGoogleConfig) {
    super(
      config.clientId,
      config.clientSecret,
      config.userInfoEndpoint,
      config.tokenEndpoint,
      config.authUrl,
    );
    this.revokeTokenUrl = config.revokeTokenUrl ?? 'https://oauth2.googleapis.com/revoke';
  }

  async getUserData(accessToken: string): Promise<SocialAuthResponse<ISocialUser>> {
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

  async revokeToken(accessToken: string): Promise<SocialAuthResponse<void>> {
    try {
      const { data } = await axios.post(
        this.revokeTokenUrl,
        {
          token: accessToken
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );

      if (data) return { status: true, data: undefined };

      return { status: false, error: "unable to revoke token" };
    } catch (error: any) {
      return {
        status: false,
        error: error.response?.data?.error_description || error.message,
      };
    }
  }
}
